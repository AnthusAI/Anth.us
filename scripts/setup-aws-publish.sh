#!/usr/bin/env bash
#
# One-time setup for the Anth.us S3 + CloudFront deploy path with GitHub OIDC.
#
set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
BUCKET_NAME="${BUCKET_NAME:-anthus-site}"
DOMAIN="${DOMAIN:-anth.us}"
WWW_DOMAIN="www.${DOMAIN}"
HOSTED_ZONE_ID="${HOSTED_ZONE_ID:-}"
SKIP_ALIASES="${SKIP_ALIASES:-false}"
ACM_CERT_ARN="${ACM_CERT_ARN:-}"

if [ -z "$ACM_CERT_ARN" ]; then
  echo "ERROR: Set ACM_CERT_ARN to a certificate ARN covering ${DOMAIN} in us-east-1."
  exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "=== Creating S3 bucket ${BUCKET_NAME} ==="
if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
  echo "Bucket already exists"
else
  aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$AWS_REGION"
fi
aws s3api put-public-access-block --bucket "$BUCKET_NAME" --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

echo "=== Creating CloudFront Origin Access Control ==="
OAC_ID=$(aws cloudfront create-origin-access-control --origin-access-control-config \
  Name="anthus-site-oac",Description="OAC for ${BUCKET_NAME}",SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3 \
  --query 'OriginAccessControl.Id' --output text 2>/dev/null || \
  aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='anthus-site-oac'].Id" --output text | head -1)
echo "OAC ID: ${OAC_ID}"

echo "=== Creating CloudFront distribution for ${DOMAIN} ==="
CALLER_REF="anthus-site-$(date +%s)"

if [ "$SKIP_ALIASES" = "true" ]; then
  ALIASES_JSON='"Aliases": {"Quantity": 0}'
  VIEWER_CERT='"ViewerCertificate": {"CloudFrontDefaultCertificate": true}'
else
  ALIASES_JSON='"Aliases": {"Quantity": 2, "Items": ["'${DOMAIN}'", "'${WWW_DOMAIN}'"]}'
  VIEWER_CERT='"ViewerCertificate": {"CloudFrontDefaultCertificate": false, "ACMCertificateArn": "'${ACM_CERT_ARN}'", "SSLSupportMethod": "sni-only", "MinimumProtocolVersion": "TLSv1.2_2021"}'
fi

DISTRIBUTION_CONFIG=$(cat <<EOF
{
  "CallerReference": "${CALLER_REF}",
  "Comment": "Anth.us static site from S3",
  ${ALIASES_JSON},
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-${BUCKET_NAME}",
      "DomainName": "${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com",
      "OriginAccessControlId": "${OAC_ID}",
      "S3OriginConfig": {"OriginAccessIdentity": ""}
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-${BUCKET_NAME}",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {"Quantity": 2, "Items": ["GET", "HEAD"], "CachedMethods": {"Quantity": 2, "Items": ["GET", "HEAD"]}},
    "Compress": true,
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6"
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [{
      "ErrorCode": 404,
      "ResponsePagePath": "/404/index.html",
      "ResponseCode": "404",
      "ErrorCachingMinTTL": 300
    }]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100",
  ${VIEWER_CERT},
  "HttpVersion": "http2and3"
}
EOF
)

EXISTING_DIST=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items && contains(Aliases.Items, '${DOMAIN}')].Id" --output text 2>/dev/null | awk '{print $1}')
if [ -n "$EXISTING_DIST" ] && [ "$EXISTING_DIST" != "None" ]; then
  DIST_ID="$EXISTING_DIST"
  echo "Using existing distribution: ${DIST_ID}"
else
  DIST_ID=$(aws cloudfront create-distribution --distribution-config "$DISTRIBUTION_CONFIG" \
    --query 'Distribution.Id' --output text)
  echo "Created distribution: ${DIST_ID}"
fi

CF_ARN=$(aws cloudfront get-distribution --id "$DIST_ID" --query 'Distribution.ARN' --output text)
CF_DOMAIN=$(aws cloudfront get-distribution --id "$DIST_ID" --query 'Distribution.DomainName' --output text)

echo "=== Bucket policy for CloudFront OAC ==="
BUCKET_POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowCloudFrontServicePrincipal",
    "Effect": "Allow",
    "Principal": {"Service": "cloudfront.amazonaws.com"},
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::${BUCKET_NAME}/*",
    "Condition": {"StringEquals": {"AWS:SourceArn": "${CF_ARN}"}}
  }]
}
EOF
)
aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy "$BUCKET_POLICY"

echo "=== Creating GitHub OIDC provider ==="
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faabbdc756dfbb573b4e5c0d0 \
  2>/dev/null || echo "OIDC provider already exists"

OIDC_ARN="arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"

echo "=== Creating IAM role for GitHub Actions ==="
TRUST=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Federated": "${OIDC_ARN}"},
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {"token.actions.githubusercontent.com:aud": "sts.amazonaws.com"},
      "StringLike": {
        "token.actions.githubusercontent.com:sub": [
          "repo:AnthusAI/anthus-site-content:ref:refs/heads/main",
          "repo:AnthusAI/Anth.us:ref:refs/heads/main"
        ]
      }
    }
  }]
}
EOF
)
aws iam create-role --role-name anthus-deploy --assume-role-policy-document "$TRUST" 2>/dev/null || \
  aws iam update-assume-role-policy --role-name anthus-deploy --policy-document "$TRUST"

ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/anthus-deploy"

POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::${BUCKET_NAME}"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::${ACCOUNT_ID}:distribution/${DIST_ID}"
    }
  ]
}
EOF
)
aws iam put-role-policy --role-name anthus-deploy --policy-name anthus-deploy-permissions --policy-document "$POLICY"

if [ -n "$HOSTED_ZONE_ID" ]; then
  echo "=== Updating Route53 for ${DOMAIN} ==="
  aws route53 change-resource-record-sets --hosted-zone-id "$HOSTED_ZONE_ID" --change-batch "$(cat <<EOF
{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "${DOMAIN}.",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "${CF_DOMAIN}",
          "EvaluateTargetHealth": false
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "${WWW_DOMAIN}.",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "${CF_DOMAIN}",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}
EOF
)"
fi

echo ""
echo "========================================================"
echo "SETUP COMPLETE"
echo "========================================================"
echo "S3_BUCKET=${BUCKET_NAME}"
echo "CLOUDFRONT_DIST_ID=${DIST_ID}"
echo "CLOUDFRONT_DOMAIN=${CF_DOMAIN}"
echo "AWS_DEPLOY_ROLE_ARN=${ROLE_ARN}"
echo "AWS_REGION=${AWS_REGION}"
echo ""
for REPO in AnthusAI/Anth.us AnthusAI/anthus-site-content; do
  echo "gh variable set AWS_REGION         -b '${AWS_REGION}'  -R ${REPO}"
  echo "gh variable set S3_BUCKET          -b '${BUCKET_NAME}' -R ${REPO}"
  echo "gh variable set CLOUDFRONT_DIST_ID -b '${DIST_ID}'   -R ${REPO}"
  echo "gh variable set AWS_DEPLOY_ROLE_ARN  -b '${ROLE_ARN}' -R ${REPO}"
  echo ""
done
