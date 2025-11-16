# Deployment Guide

## Build Optimization
✅ Removed unused texture folders (reduced build from 12MB to 3.3MB)
✅ Build is production-ready

## Environment Variables

Create `.env.production` file in `frontend/` directory:
```
VITE_WS_URL=wss://your-backend-url.com
VITE_API_URL=https://your-backend-url.com
```

Replace `your-backend-url.com` with your actual deployed backend URL.

## Deployment Options

### Option 1: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` from the `frontend/` directory
3. Or connect your GitHub repo at https://vercel.com
4. **Add environment variables** in Vercel dashboard:
   - `VITE_WS_URL` (WebSocket URL - use `wss://` for secure)
   - `VITE_API_URL` (API URL - use `https://`)

**Configuration:** `vercel.json` is already set up

### Option 2: Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod` from the `frontend/` directory
3. Or connect your GitHub repo at https://netlify.com
4. **Add environment variables** in Netlify dashboard:
   - `VITE_WS_URL`
   - `VITE_API_URL`

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

## Connecting to Backend

After deploying both frontend and backend:

1. **Get your backend URL** (e.g., `https://your-backend.railway.app`)

2. **Update frontend environment variables:**
   - For Vercel: Dashboard → Settings → Environment Variables
   - For Netlify: Site settings → Build & deploy → Environment variables
   - For static hosting: Create `.env.production` before building

3. **Rebuild frontend** with new environment variables

## Notes
- The build uses React Router, so all routes need to redirect to `index.html` (SPA routing)
- Both `vercel.json` and `netlify.toml` are configured for this
- Build size: ~3.3MB (optimized)
- WebSocket connections must use `wss://` (secure WebSocket) in production
- CORS must be configured on backend to allow your frontend domain
