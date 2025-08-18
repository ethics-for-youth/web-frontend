# Simple Multi-Environment Deployment Setup

This guide shows you how to set up multi-environment deployment for your React app.

## 🎯 What Changed

Your existing workflow now supports:
- **dev** environment (develop branch)
- **qa** environment (qa branch) 
- **prod** environment (main branch)

## 📋 Required Setup

### 1. Create S3 Buckets

Create these S3 buckets in AWS:
```
efy-dev-env    (for development)
efy-qa-env     (for QA/testing)
efy-prod-env   (for production)
```

### 2. Configure GitHub Secrets and Environments

#### Repository Secrets (Settings → Secrets and variables → Actions → Secrets):
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key

#### GitHub Environments (Settings → Environments):
Create three environments: `dev`, `qa`, and `prod`

**For each environment, add these variables:**
- `S3_BUCKET` - S3 bucket name for the environment
- `API_URL` - API URL for the environment

**Example:**
- **dev environment**: `S3_BUCKET=efy-dev-env`, `API_URL=https://dev-api.example.com`
- **qa environment**: `S3_BUCKET=efy-qa-env`, `API_URL=https://qa-api.example.com`
- **prod environment**: `S3_BUCKET=efy-prod-env`, `API_URL=https://api.example.com`

### 3. Create Branches

```bash
# Create qa branch for QA environment
git checkout -b qa
git push origin qa
```

## 🚀 How to Deploy

### Automatic Deployments
```bash
# Deploy to dev
git push origin develop

# Deploy to qa
git push origin qa

# Deploy to prod
git push origin main
```

### Manual Deployments
1. Go to GitHub → Actions
2. Select "Deploy React App to S3"
3. Click "Run workflow"
4. Choose environment (dev/qa/prod)
5. Click "Run workflow"

## 🌐 Environment URLs

After deployment, your apps will be available at:
- **Dev**: `http://efy-dev-env.s3-website.ap-south-1.amazonaws.com`
- **QA**: `http://efy-qa-env.s3-website.ap-south-1.amazonaws.com`
- **Prod**: `http://efy-prod-env.s3-website.ap-south-1.amazonaws.com`

## 🔧 S3 Bucket Setup

Each bucket needs:
1. **Static website hosting** enabled
2. **Public read access** policy
3. **CORS** configured

### Quick AWS CLI Setup

```bash
# For each bucket (replace BUCKET_NAME with actual bucket name)
aws s3api create-bucket --bucket BUCKET_NAME --region ap-south-1 --create-bucket-configuration LocationConstraint=ap-south-1

# Enable website hosting
aws s3api put-bucket-website --bucket BUCKET_NAME --website-configuration '{"IndexDocument":{"Suffix":"index.html"},"ErrorDocument":{"Key":"index.html"}}'

# Set public read policy
aws s3api put-bucket-policy --bucket BUCKET_NAME --policy '{"Version":"2012-10-17","Statement":[{"Sid":"PublicReadGetObject","Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::BUCKET_NAME/*"}]}'
```

## 🔧 GitHub Environment Setup

### 1. Create Environments
1. Go to your repository → Settings → Environments
2. Click "New environment"
3. Create three environments: `dev`, `qa`, `prod`

### 2. Configure Environment Variables
For each environment, add these variables:

**dev environment:**
- `S3_BUCKET`: `efy-dev-env`
- `API_URL`: `https://dev-api.example.com`

**qa environment:**
- `S3_BUCKET`: `efy-qa-env`
- `API_URL`: `https://qa-api.example.com`

**prod environment:**
- `S3_BUCKET`: `efy-prod-env`
- `API_URL`: `https://api.example.com`

## ✅ Test Your Setup

1. Push to `develop` branch
2. Check GitHub Actions for deployment status
3. Visit your dev environment URL
4. Verify the app loads correctly

## 🔄 Environment Variables

The workflow automatically creates environment-specific `.env` files with:
- `VITE_API_URL` - Environment-specific API URL
- `VITE_ENVIRONMENT` - Environment name (dev/qa/prod)
- `VITE_VERSION` - Git commit SHA
- `VITE_BUILD_DATE` - Build timestamp

## 🛡️ Safety Features

- **Change detection**: Only deploys when build output changes
- **Backups**: Creates backups before each deployment
- **Rollback**: Automatic rollback on failure
- **Cleanup**: Removes old backups (keeps last 5)

## 🆘 Troubleshooting

**Deployment fails:**
- Check AWS credentials in GitHub secrets
- Verify S3 bucket names match exactly
- Ensure S3 buckets have proper permissions

**App not loading:**
- Check S3 bucket website hosting is enabled
- Verify bucket policy allows public read access
- Check CORS configuration

**Environment variables not working:**
- Verify environment variables are set in GitHub Environments
- Check that the environment names match exactly (dev, qa, prod)
- Ensure the workflow has access to the environment
