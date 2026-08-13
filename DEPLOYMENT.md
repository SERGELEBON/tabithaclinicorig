# Deployment Guide - Vercel

## Quick Setup

### 1. Configure Environment Variables in Vercel

Go to your Vercel project → **Settings** → **Environment Variables** and add:

#### Required Variables
```
VITE_FRONTEND_FORGE_API_KEY=your_actual_forge_api_key
VITE_FRONTEND_FORGE_API_URL=https://forge.butterfly-effect.dev
```

#### Optional Variables (for analytics)
```
VITE_ANALYTICS_ENDPOINT=https://your-umami-instance.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

### 2. Deploy
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push
```

Vercel will automatically deploy on push if connected to your Git repository.

## Common Issues

### ❌ Google Maps shows "key=undefined"
**Cause:** `VITE_FRONTEND_FORGE_API_KEY` is not set in Vercel environment variables.

**Fix:**
1. Go to Vercel Project Settings → Environment Variables
2. Add `VITE_FRONTEND_FORGE_API_KEY` with your actual API key
3. Redeploy the project

### ❌ Umami analytics fails with ERR_HTTP2_PROTOCOL_ERROR
**Cause:** Umami analytics variables are not set, resulting in invalid script URLs.

**Fix:** Either:
- Set `VITE_ANALYTICS_ENDPOINT` and `VITE_ANALYTICS_WEBSITE_ID` in Vercel
- Or remove the analytics script from `client/index.html` if not using analytics

### ❌ Images from /manus-storage/ not loading
**Cause:** Storage proxy requires `BUILT_IN_FORGE_API_KEY` for authentication.

**Fix:**
1. Add `BUILT_IN_FORGE_API_URL` and `BUILT_IN_FORGE_API_KEY` to Vercel environment variables
2. Or migrate images to Vercel's public folder or a CDN

## Build Configuration

The `vercel.json` file is configured to:
- Build with `pnpm build`
- Output to `dist/public`
- Handle client-side routing (SPA mode)

No server functions are used - this deploys as a static site with client-side routing.

## Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your environment variables in `.env`

3. Install and run:
   ```bash
   pnpm install
   pnpm dev
   ```

## Vercel CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```