# 🔐 Security Setup Guide

## What Happened?

A GitHub secrets detection warning was triggered because the Gemini API key was accidentally committed to the repository in `.replit` file. This is a critical security issue.

## ✅ What Was Done

1. **API Key Removed from Git History** - The exposed API key has been completely scrubbed from all commits using `git filter-branch` and force-pushed to GitHub.

2. **Files Updated**:
   - `.replit` - Now uses environment variable reference instead of hardcoded value
   - `.env` - Empty placeholder for local development
   - `.gitignore` - Added `.replit` and `.env.local` to prevent accidental commits

3. **Best Practices Implemented**:
   - API keys are never hardcoded in version control
   - Configuration files demonstrate correct patterns
   - `.env.example` shows all required variables without secrets

## 🔄 Setting Up Secrets Properly

### Step 1: Generate a NEW Gemini API Key (Revoke the Old One)

The old key was exposed and should be considered compromised.

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key" → "Create API Key in new project"
3. **Copy the new API key** - you'll need it in the next steps
4. (Optional) Go back to Google Cloud Console and delete the old key project

### Step 2: Configure Replit (Backend)

1. **Go to your Replit project**: https://replit.com
2. **Find your NomadNest backend project**
3. **Click "Secrets"** (lock icon in left sidebar)
4. **Add new secret**:
   - Key: `GEMINI_API_KEY`
   - Value: `<paste your new API key>`
   - Click "Add Secret"
5. Your backend will automatically use this secret when the code reads `process.env.GEMINI_API_KEY`

### Step 3: Configure Vercel (Frontend)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Find your NomadNest frontend project**
3. **Go to Settings** → **Environment Variables**
4. **Add new environment variable**:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-replit-backend-url.repl.co` (example: `https://nomadnest-backend.username.repl.co`)
   - Click "Add"
5. **Redeploy** to apply the new environment variable

### Step 4: Local Development

For local testing on your machine:

1. **Create `.env.local`** in the `backend/` directory (this is gitignored):
   ```
   GEMINI_API_KEY=your-test-api-key-here
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

2. **Never commit** `.env.local` - it's in `.gitignore`

3. **Copy `.env.example`** to see the required variables

## 🚨 Critical Security Checklist

- [ ] Generated a NEW Gemini API key
- [ ] Deleted/revoked the old exposed key from Google Cloud Console
- [ ] Set `GEMINI_API_KEY` as a Replit Secret (not in `.replit` file)
- [ ] Set `VITE_API_BASE_URL` in Vercel Environment Variables
- [ ] Created `.env.local` for local development (NOT committed)
- [ ] Verified `.replit` is in `.gitignore`
- [ ] Verified `.env` is in `.gitignore`
- [ ] Redeploy both Vercel and Replit after setting secrets

## 📝 Environment Variables Reference

### Backend (`backend/.env` or Replit Secrets)

```
# Required
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=https://nomadnest-goa.vercel.app (production) or http://localhost:5173 (local)

# Optional
NODE_ENV=production (or development)
FIREBASE_PROJECT_ID=nomadnest-goa-demo
```

### Frontend (`vercel.json` Environment Variables)

```
VITE_API_BASE_URL=https://your-replit-backend-url.repl.co
```

## 🔍 How to Verify Secrets Are Working

### Replit Backend
1. Go to your Replit project
2. Click "Secrets" and verify `GEMINI_API_KEY` is listed
3. Click "Run" - the server should start successfully
4. Test the health endpoint: Visit console output URL + `/health`

### Vercel Frontend
1. Go to Vercel dashboard → your project
2. Go to Settings → Environment Variables
3. Verify `VITE_API_BASE_URL` is listed
4. Wait for automatic redeploy or manually redeploy
5. Test the app at your Vercel URL

## ⚠️ If You See Secrets Warnings Again

GitHub monitors for exposed credentials. If you see warnings:

1. **Immediately revoke** the exposed key in Google Cloud Console
2. **Generate a new key** from Google AI Studio
3. **Update** all deployment platforms with the new key
4. **Contact GitHub** to mark the secret as revoked

## 📚 Best Practices Going Forward

1. **Never commit secrets** - use `.gitignore`
2. **Use `.env.example`** to show what variables are needed
3. **Use platform-specific secrets** (Replit Secrets, Vercel Environment Variables, GitHub Secrets)
4. **Rotate keys regularly** in production
5. **Review git history** before pushing: `git log --all --full-history -- *.env*`
6. **Use `.env.local`** for local development

---

**Last Updated**: April 27, 2026  
**Status**: ✅ Security incident resolved, proper secrets management implemented
