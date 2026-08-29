#!/usr/bin/env bash
#
# One-time setup for the Anth.us S3 + CloudFront deploy path with GitHub OIDC.
#
# Creates:
#   - S3 bucket for static site hosting
#   - CloudFront distribution serving the bucket over HTTPS
#   - GitHub OIDC identity provider in IAM
#   - IAM role assumable by GitHub Actions (no long-lived secrets)
#
# Prints the GitHub Actions Variables to set on both repos.
#
# Usage: ./scripts/setup-aws-publish.sh
# Requires: aws CLI configured with admin credentials, a Route53-hosted zone
# for anth.us (or set DOMAIN_ZONE_ID), and an ACM certificate in us-east-1.
#
set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
BUCKET_NAME="${BUCKET_NAME:-anthus-site}"
DOMAIN="${DOMAIN:-anth.us}"
WWW_DOMAIN="www.${DOMAIN}"
# ACM certificate ARN must be in us-east-1 for CloudFront. Create it first if missing.
ACM_CERT_ARN="${ACM_CERT_ARN:-}"

if [ -z "$ACM_CERT_ARN" ]; then
  echo "ERROR: Set ACM_CERT_ARN to a certificate ARN covering ${DOMAIN} in us-east-1."
  echo "Create one with:"
  echo "  aws acm request-certificate --domain-name ${DOMAIN} --subject-alternative-names ${WWW_DOMAIN} --validation-method DNS --region us-east-1"
  exit 1
fi

echo "=== Creating S3 bucket ${BUCKET_NAME} ==="
aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$AWS_REGION" --acl private || true
aws s3api put-bucket-website --bucket "$BUCKET_NAME" --website-configuration \
  '{"IndexDocument":{"Suffix":"index.html"},"ErrorDocument":{"Key":"404/index.html"}}' || true
aws s3api put-public-access-block --bucket "$BUCKET_NAME" --public-access-block-configuration \
  BlockPublicAcl=true,IgnorePublicAcl=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

echo "=== Creating CloudFront distribution for ${DOMAIN} ==="
DISTRIBUTION_CONFIG=$(cat <<EOF
{
  "CallerReference": "anthus-site-$(date +%s)",
  "Aliases": {"Quantity": 2, "Items": ["${DOMAIN}", "${WWW_DOMAIN}"]},
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-${BUCKET_NAME}",
      "DomainName": "${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com",
      "S3OriginConfig": {"OriginAccessIdentity": ""}
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-${BUCKET_NAME}",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {"Enabled": false, "Quantity": 0},
    "ForwardedValues": {"QueryString": false, "Cookies": {"Forward": "none"}},
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100",
  "ViewerCertificate": {
    "CloudFrontDefaultCertificate": false,
    "ACMCertificateArn": "${ACM_CERT_ARN}",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "HttpVersion": "http2"
}
EOF
)
DIST_ID=$(aws cloudfront create-distribution --distribution-config "$DISTRIBUTION_CONFIG" \
  --query 'Distribution.Id' --output text)
echo "Distribution ID: ${DIST_ID}"

echo "=== Creating GitHub OIDC provider ==="
# Create the IAM OIDC provider for GitHub (idempotent)
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faabbdc756dfbb573b4e5c0d0 0000000000000000000000000000000000000000 \
  2>/dev/null || echo "OIDC provider already exists"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
OIDC_ARN="arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"

echo "=== Creating IAM role for GitHub Actions ==="
# Trust policy: allow both repos to assume the role from main
TRUST=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Federated": "${OIDC_ARN}"},
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
      },
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

# Attach permissions policy
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

echo ""
echo "========================================================"
echo "SETUP COMPLETE. Set these as GitHub Actions VARIABLES"
echo "(not secrets) on both AnthusAI/Anth.us and AnthusAI/"
echo "anthus-site-content:"
echo "========================================================"
echo ""
echo "  gh variable set AWS_REGION        -b '${AWS_REGION}'  -R AnthusAI/Anth.us"
echo "  gh variable set S3_BUCKET         -b '${BUCKET_NAME}' -R AnthusAI/Anth.us"
echo "  gh variable set CLOUDFRONT_DIST_ID -b '${DIST_ID}'   -R AnthusAI/Anth.us"
echo "  gh variable set AWS_DEPLOY_ROLE_ARN -b '${ROLE_ARN}' -R AnthusAI/Anth.us"
echo ""
echo "  gh variable set AWS_REGION        -b '${AWS_REGION}'  -R AnthusAI/anthus-site-content"
echo "  gh variable set S3_BUCKET         -b '${BUCKET_NAME}' -R AnthusAI/anthus-site-content"
echo "  gh variable set CLOUDFRONT_DIST_ID -b '${DIST_ID}'   -R AnthusAI/anthus-site-content"
echo "  gh variable set AWS_DEPLOY_ROLE_ARN -b '${ROLE_ARN}' -R AnthusAI/anthus-site-content"
echo ""
echo "CloudFront domain (until DNS is pointed):"
aws cloudfront get-distribution --id "$DIST_ID" --query 'Distribution.DomainName' --output text
echo ""
echo "Next: point ${DOMAIN} DNS at the CloudFront distribution."
