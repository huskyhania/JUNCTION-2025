# Deployment Guide

## Build Optimization
✅ Removed unused texture folders (reduced build from 12MB to 3.3MB)
✅ Build is production-ready

## Deployment Options

### Option 1: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` from the `frontend/` directory
3. Or connect your GitHub repo at https://vercel.com

**Configuration:** `vercel.json` is already set up

### Option 2: Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod` from the `frontend/` directory
3. Or connect your GitHub repo at https://netlify.com

**Configuration:** `netlify.toml` is already set up

### Option 3: Other Static Hosting
- **GitHub Pages:** Push `dist/` folder to `gh-pages` branch
- **AWS S3 + CloudFront:** Upload `dist/` to S3 bucket
- **Cloudflare Pages:** Connect GitHub repo
- **Any static host:** Upload the `dist/` folder

## Build Command
```bash
cd frontend
npm run build
```

The built files will be in the `dist/` folder.

## Environment Variables
If you need environment variables, create a `.env.production` file:
```
VITE_API_URL=https://your-api-url.com
```

## Notes
- The build uses React Router, so all routes need to redirect to `index.html` (SPA routing)
- Both `vercel.json` and `netlify.toml` are configured for this
- Build size: ~3.3MB (optimized)

