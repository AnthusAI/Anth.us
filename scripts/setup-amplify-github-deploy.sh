#!/usr/bin/env bash
#
# One-time setup for deploying Anth.us to Amplify from GitHub Actions.
#
# GitHub Actions builds and verifies the site, then uploads the verified build
# to an Amplify app that is not connected to Git, so Amplify never runs a build.
# Amplify only accepts uploaded builds on apps without a Git connection, which is
# why this creates a new app instead of reusing the Git-connected one.
#
# Moving the anth.us custom domain from the Git-connected app to the new app is
# a separate, deliberate step. This script prints it but does not do it.
#
set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
NEW_AMPLIFY_APP_NAME="${NEW_AMPLIFY_APP_NAME:-anthus-site}"
AMPLIFY_PRODUCTION_BRANCH="${AMPLIFY_PRODUCTION_BRANCH:-main}"
AMPLIFY_DEVELOPMENT_BRANCH="${AMPLIFY_DEVELOPMENT_BRANCH:-develop}"
GIT_CONNECTED_AMPLIFY_APP_ID="${GIT_CONNECTED_AMPLIFY_APP_ID:-}"
GITHUB_DEPLOY_ROLE_NAME="${GITHUB_DEPLOY_ROLE_NAME:-anthus-deploy}"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "=== Finding or creating the Amplify app ${NEW_AMPLIFY_APP_NAME} (no Git connection) ==="
NEW_AMPLIFY_APP_ID_CANDIDATES=$(aws amplify list-apps --region "$AWS_REGION" \
  --query "apps[?name=='${NEW_AMPLIFY_APP_NAME}' && (repository==null || repository=='')].appId" --output text)
NEW_AMPLIFY_APP_ID=$(printf '%s\n' "$NEW_AMPLIFY_APP_ID_CANDIDATES" | tr -s '[:space:]' '\n' \
  | { grep -v '^$' || true; } | head -n 1)
if [ -z "$NEW_AMPLIFY_APP_ID" ]; then
  NEW_AMPLIFY_APP_ID=$(aws amplify create-app --region "$AWS_REGION" --name "$NEW_AMPLIFY_APP_NAME" \
    --platform WEB --query 'app.appId' --output text)
  echo "Created app ${NEW_AMPLIFY_APP_ID}"
else
  echo "Using existing app ${NEW_AMPLIFY_APP_ID}"
fi

create_amplify_branch_if_missing() {
  local amplify_branch_name="$1"
  local amplify_branch_stage="$2"
  echo "=== Finding or creating branch ${amplify_branch_name} (${amplify_branch_stage}) ==="
  if aws amplify get-branch --region "$AWS_REGION" --app-id "$NEW_AMPLIFY_APP_ID" \
    --branch-name "$amplify_branch_name" >/dev/null 2>&1; then
    echo "Branch already exists"
  else
    aws amplify create-branch --region "$AWS_REGION" --app-id "$NEW_AMPLIFY_APP_ID" \
      --branch-name "$amplify_branch_name" --stage "$amplify_branch_stage" >/dev/null
    echo "Created branch ${amplify_branch_name}"
  fi
}
create_amplify_branch_if_missing "$AMPLIFY_PRODUCTION_BRANCH" PRODUCTION
create_amplify_branch_if_missing "$AMPLIFY_DEVELOPMENT_BRANCH" DEVELOPMENT

if [ -n "$GIT_CONNECTED_AMPLIFY_APP_ID" ]; then
  echo "=== Copying redirects and custom headers from ${GIT_CONNECTED_AMPLIFY_APP_ID} ==="
  CUSTOM_RULES_JSON=$(aws amplify get-app --region "$AWS_REGION" --app-id "$GIT_CONNECTED_AMPLIFY_APP_ID" \
    --query 'app.customRules' --output json)
  CUSTOM_HEADERS_TEXT=$(aws amplify get-app --region "$AWS_REGION" --app-id "$GIT_CONNECTED_AMPLIFY_APP_ID" \
    --query 'app.customHeaders' --output text)
  if [ "$CUSTOM_RULES_JSON" != "null" ] && [ "$CUSTOM_RULES_JSON" != "[]" ]; then
    aws amplify update-app --region "$AWS_REGION" --app-id "$NEW_AMPLIFY_APP_ID" \
      --custom-rules "$CUSTOM_RULES_JSON" >/dev/null
    echo "Copied redirect and rewrite rules"
  fi
  if [ -n "$CUSTOM_HEADERS_TEXT" ] && [ "$CUSTOM_HEADERS_TEXT" != "None" ]; then
    aws amplify update-app --region "$AWS_REGION" --app-id "$NEW_AMPLIFY_APP_ID" \
      --custom-headers "$CUSTOM_HEADERS_TEXT" >/dev/null
    echo "Copied custom headers"
  fi
fi

echo "=== Allowing ${GITHUB_DEPLOY_ROLE_NAME} to deploy to the app ==="
AMPLIFY_APP_ARN="arn:aws:amplify:${AWS_REGION}:${ACCOUNT_ID}:apps/${NEW_AMPLIFY_APP_ID}"
DEPLOY_POLICY=$(cat <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["amplify:CreateDeployment", "amplify:StartDeployment", "amplify:GetJob"],
    "Resource": ["${AMPLIFY_APP_ARN}", "${AMPLIFY_APP_ARN}/*"]
  }]
}
POLICY
)
aws iam put-role-policy --role-name "$GITHUB_DEPLOY_ROLE_NAME" \
  --policy-name anthus-amplify-deploy --policy-document "$DEPLOY_POLICY"
ROLE_ARN=$(aws iam get-role --role-name "$GITHUB_DEPLOY_ROLE_NAME" --query 'Role.Arn' --output text)

echo ""
echo "========================================================"
echo "SETUP COMPLETE"
echo "========================================================"
echo "Set these repository variables on AnthusAI/Anth.us:"
echo "gh variable set AWS_REGION          -b '${AWS_REGION}'          -R AnthusAI/Anth.us"
echo "gh variable set AWS_DEPLOY_ROLE_ARN -b '${ROLE_ARN}'            -R AnthusAI/Anth.us"
echo "gh variable set AMPLIFY_APP_ID      -b '${NEW_AMPLIFY_APP_ID}'  -R AnthusAI/Anth.us"
echo "gh variable set AMPLIFY_PRODUCTION_BRANCH  -b '${AMPLIFY_PRODUCTION_BRANCH}'  -R AnthusAI/Anth.us"
echo "gh variable set AMPLIFY_DEVELOPMENT_BRANCH -b '${AMPLIFY_DEVELOPMENT_BRANCH}' -R AnthusAI/Anth.us"
echo ""
echo "Then run the 'Build, verify, and deploy' workflow on develop and on main, and check:"
echo "  https://${AMPLIFY_DEVELOPMENT_BRANCH}.${NEW_AMPLIFY_APP_ID}.amplifyapp.com/"
echo "  https://${AMPLIFY_PRODUCTION_BRANCH}.${NEW_AMPLIFY_APP_ID}.amplifyapp.com/"
echo ""
echo "When that looks right, move the custom domain in the Amplify console:"
echo "  1. Remove anth.us from the Git-connected app (Hosting > Custom domains)."
echo "  2. Add anth.us and www.anth.us to ${NEW_AMPLIFY_APP_ID}, branch ${AMPLIFY_PRODUCTION_BRANCH}."
echo "  3. Delete the Git-connected app, or turn off its automatic builds, so it stops building."
