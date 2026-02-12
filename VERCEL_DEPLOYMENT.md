# 🚀 Vercel Deployment Guide

Complete guide to deploy the Vehicle Insurance Prediction Model on Vercel.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Deployment Steps](#deployment-steps)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)
- [Limitations & Considerations](#limitations--considerations)

## ✅ Prerequisites

Before deploying to Vercel, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your project should be pushed to GitHub
3. **Trained Model**: Model file at `artifact/02_10_2026_14_49_37/model_trainer/trained_model/model.pkl`
4. **Vercel CLI** (Optional): Install with `npm i -g vercel`

## 📁 Project Structure for Vercel

Your project now includes these Vercel-specific files:

```
Vehicle-Insurance-Prediction-Model/
├── vercel.json              # Vercel configuration
├── .vercelignore           # Files to exclude from deployment
├── requirements-vercel.txt # Minimal dependencies for Vercel
├── api/
│   └── index.py           # Serverless function entry point
├── templates/
│   └── index.html         # Frontend HTML
├── static/
│   ├── css/
│   └── js/
├── artifact/              # Model files (only trained model included)
└── src/                   # Source code modules
```

## 🚀 Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New Project"

2. **Import Your Repository**
   - Select "Import Git Repository"
   - Choose your GitHub repository: `Vehicle-Insurance-Prediction-Model`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty (not needed for Python)
   - **Output Directory**: Leave empty
   - **Install Command**: `pip install -r requirements-vercel.txt`

4. **Add Environment Variables** (if needed)
   ```
   MONGO_DB_URL=your_mongodb_connection_string
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   FLASK_ENV=production
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Root**
   ```bash
   # Navigate to project directory
   cd Vehicle-Insurance-Prediction-Model
   
   # Deploy to production
   vercel --prod
   ```

4. **Follow CLI Prompts**
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N` (for first deployment)
   - Project name? `vehicle-insurance-prediction`
   - In which directory is your code located? `./`

5. **Deployment Complete**
   - CLI will display your deployment URL
   - Visit the URL to see your live application

### Method 3: Deploy via GitHub Integration

1. **Connect Vercel to GitHub**
   - Go to Vercel Dashboard
   - Click "Import Project"
   - Authorize Vercel on GitHub

2. **Auto-Deploy on Push**
   - Every push to `main` branch will auto-deploy
   - Pull requests get preview deployments
   - Production URL remains stable

## 🔐 Environment Variables

### Required Variables (if using full features)

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_DB_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `AWS_ACCESS_KEY_ID` | AWS access key (for S3) | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `FLASK_ENV` | Flask environment | `production` |

### How to Add Environment Variables

1. Go to your project in Vercel Dashboard
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add each variable:
   - Name: Variable name (e.g., `MONGO_DB_URL`)
   - Value: Variable value
   - Environment: Select Production, Preview, Development
5. Click "Save"

## ✅ Post-Deployment

### Verify Deployment

1. **Test Home Page**
   ```
   https://your-project.vercel.app/
   ```
   Should display the prediction form.

2. **Test Health Endpoint**
   ```
   https://your-project.vercel.app/health
   ```
   Should return:
   ```json
   {
     "status": "healthy",
     "model_loaded": true,
     "model_path": "..."
   }
   ```

3. **Test Prediction API**
   ```bash
   curl -X POST https://your-project.vercel.app/predict \
     -H "Content-Type: application/json" \
     -d '{
       "gender": 1,
       "age": 35,
       "driving_license": 1,
       "region_code": 28,
       "previously_insured": 0,
       "annual_premium": 40000,
       "policy_sales_channel": 152,
       "vintage": 154,
       "vehicle_age_lt_1_year": 0,
       "vehicle_age_gt_2_years": 0,
       "vehicle_damage_yes": 1
     }'
   ```

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Build Timeout
**Problem**: Deployment times out during build
**Solution**: 
- Use `requirements-vercel.txt` instead of full `requirements.txt`
- Remove heavy dependencies not needed for prediction
- Reduce model file size if possible

#### 2. Model Not Found
**Problem**: `Model not found` error
**Solution**:
- Ensure model file is in `artifact/02_10_2026_14_49_37/model_trainer/trained_model/model.pkl`
- Check `.vercelignore` doesn't exclude the model
- Verify model file is committed to Git (not in `.gitignore`)

#### 3. Import Errors
**Problem**: `ModuleNotFoundError: No module named 'src'`
**Solution**:
- Ensure `src/` directory structure is correct
- Check `api/index.py` has correct path handling
- Verify `setup.py` is properly configured

#### 4. Function Size Limit
**Problem**: Deployment exceeds 50MB limit
**Solution**:
- Use Vercel Pro plan (250MB limit)
- Optimize model file (compression, quantization)
- Consider storing model in external storage (S3, GitHub LFS)

#### 5. Cold Start Issues
**Problem**: First request is slow
**Solution**:
- This is normal for serverless functions
- Model loads on first request (5-10 seconds)
- Consider using Vercel Edge Functions for faster cold starts
- Use caching strategies

### Viewing Logs

1. **Vercel Dashboard**
   - Go to your project
   - Click "Deployments"
   - Click on a deployment
   - View "Build Logs" and "Function Logs"

2. **Real-time Logs via CLI**
   ```bash
   vercel logs your-project.vercel.app
   ```

## ⚠️ Limitations & Considerations

### Vercel Free Tier Limits
- **Function Size**: 50MB (compressed)
- **Function Memory**: 1024MB
- **Execution Time**: 10 seconds per request
- **Bandwidth**: 100GB/month
- **Build Minutes**: 6000 minutes/month

### Workarounds for Large Models

If your model exceeds limits:

1. **Use Vercel Pro**: Increases limits significantly
2. **External Model Storage**:
   ```python
   # Example: Load model from S3
   import boto3
   s3 = boto3.client('s3')
   s3.download_file('bucket', 'model.pkl', '/tmp/model.pkl')
   ```
3. **Model Compression**: Use quantization or pruning
4. **Alternative Deployment**: Consider Railway, Render, or AWS Lambda

### Performance Optimization

1. **Enable Caching**
   - Add caching headers for static assets
   - Cache model in global variable (already implemented)

2. **Use CDN**
   - Vercel automatically uses CDN for static files
   - Leverage edge network for better performance

3. **Optimize Response Size**
   - Minimize JSON responses
   - Compress responses (gzip)

## 📊 Monitoring

### Built-in Analytics

Vercel provides:
- Request count and response times
- Error rate tracking
- Geographic distribution
- Performance insights

Access at: Dashboard → Your Project → Analytics

### Custom Monitoring

Add application monitoring:
- **Sentry**: Error tracking
- **LogDNA**: Log management
- **New Relic**: APM (Application Performance Monitoring)

## 🔄 Updates and Redeployment

### Automatic Deployment
- Push to `main` branch → Auto-deploy to production
- Push to other branches → Preview deployment

### Manual Redeployment
```bash
vercel --prod
```

### Rollback
1. Go to Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

## 🎯 Best Practices

1. **Use Environment Variables**: Never hardcode secrets
2. **Test Locally First**: Use `vercel dev` for local testing
3. **Monitor Logs**: Regularly check for errors
4. **Optimize Model**: Keep model size minimal
5. **Enable CORS**: If building separate frontend
6. **Use HTTPS**: Vercel provides free SSL
7. **Set Up Alerts**: Configure Vercel notifications

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Python Runtime](https://vercel.com/docs/runtimes#official-runtimes/python)
- [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Model file included in repository
- [ ] `vercel.json` configured
- [ ] `api/index.py` created
- [ ] `.vercelignore` updated
- [ ] Requirements optimized
- [ ] Environment variables prepared
- [ ] Project created in Vercel
- [ ] Deployment successful
- [ ] Health endpoint tested
- [ ] Prediction API tested
- [ ] Custom domain configured (optional)
- [ ] Monitoring enabled

## 🎉 Success!

Your Vehicle Insurance Prediction Model is now live on Vercel! 🚀

Access your application at: `https://your-project.vercel.app`

**Example Deployment URL**: `https://vehicle-insurance-prediction.vercel.app`

For support, check the troubleshooting section or refer to Vercel documentation.

---

**Made with ❤️ for Vercel deployment**
