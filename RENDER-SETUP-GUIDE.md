# DropZone Render Deployment Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Push render.yaml to GitHub
```bash
cd /Users/I870089/dropzone
git add render.yaml RENDER-SETUP-GUIDE.md
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Create Render Blueprint

1. Go to https://dashboard.render.com
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub account (if not already)
4. Select repository: **chadlmc1970/dropzone**
5. Render detects `render.yaml` automatically
6. Click **"Apply"**

### Step 3: Set Environment Variables

Render will create 2 services and prompt for environment variables.

#### Backend API (dropzone-api)

**Database:**
- `DATABASE_URL`: Get from Neon dashboard → Connection String
  - Format: `postgresql://user:password@host/dbname?sslmode=require`

**Auth0 (create free tenant at https://manage.auth0.com):**
- `AUTH0_DOMAIN`: Your Auth0 domain (e.g., `your-tenant.us.auth0.com`)
- `AUTH0_CLIENT_ID`: From Auth0 Application settings
- `AUTH0_CLIENT_SECRET`: From Auth0 Application settings
- `AUTH0_AUDIENCE`: Your Auth0 API identifier (e.g., `https://dropzone-api`)

**Spotify (create app at https://developer.spotify.com/dashboard):**
- `SPOTIFY_CLIENT_ID`: From Spotify Dashboard
- `SPOTIFY_CLIENT_SECRET`: From Spotify Dashboard

**Auto-generated (no action needed):**
- `JWT_SECRET_KEY`: Render generates automatically
- `CORS_ORIGINS`: Pre-configured to `https://dropzone-dashboard.onrender.com`
- `FRONTEND_URL`: Pre-configured to `https://dropzone-dashboard.onrender.com`

#### Web Frontend (dropzone-dashboard)

**Auth0:**
- `NEXT_PUBLIC_AUTH0_DOMAIN`: Same as backend AUTH0_DOMAIN
- `NEXT_PUBLIC_AUTH0_CLIENT_ID`: From Auth0 Application settings (can be same as backend or separate SPA client)

**Auto-configured (no action needed):**
- `NEXT_PUBLIC_API_URL`: Pre-configured to `https://dropzone-api.onrender.com`
- `NEXT_PUBLIC_AUTH0_CALLBACK_URL`: Pre-configured to `https://dropzone-dashboard.onrender.com/callback`
- `NODE_ENV`: Set to `production`

### Step 4: Deploy & Verify (2 minutes)

Render automatically builds and deploys both services.

**Backend Health Check:**
```bash
curl https://dropzone-api.onrender.com/health
# Expected: {"status":"healthy","service":"dropzone-api"}
```

**Web Frontend Check:**
```bash
curl -I https://dropzone-dashboard.onrender.com
# Expected: HTTP/2 200
```

**API Docs:**
- https://dropzone-api.onrender.com/docs (Swagger UI)
- https://dropzone-api.onrender.com/redoc (ReDoc)

---

## 🔄 Auto-Deploy Workflow (After Initial Setup)

Once configured, deployments are automatic:

```bash
# Make changes locally
vim backend/app/api/tracks.py

# Commit and push
git add -A
git commit -m "Add cue point detection"
git push origin main

# Render auto-deploys in ~2 minutes
# No manual steps needed!
```

---

## 🎯 Service URLs (After Deployment)

| Service | URL |
|---------|-----|
| Backend API | https://dropzone-api.onrender.com |
| API Docs | https://dropzone-api.onrender.com/docs |
| Web Dashboard | https://dropzone-dashboard.onrender.com |
| Health Check | https://dropzone-api.onrender.com/health |

---

## 🔑 Where to Get Credentials

### Neon Database (Free Tier)
1. Go to https://console.neon.tech
2. Create new project: "dropzone-production"
3. Copy connection string from dashboard
4. Paste as `DATABASE_URL` in Render

### Auth0 (Free Tier)
1. Go to https://manage.auth0.com
2. Create new tenant (if needed)
3. Create Application → **Single Page Application**
4. Configure:
   - Allowed Callback URLs: `https://dropzone-dashboard.onrender.com/callback`
   - Allowed Logout URLs: `https://dropzone-dashboard.onrender.com`
   - Allowed Web Origins: `https://dropzone-dashboard.onrender.com`
5. Copy Domain, Client ID, Client Secret
6. Create API: Applications → APIs → Create API
   - Name: "DropZone API"
   - Identifier: `https://dropzone-api` (use as AUTH0_AUDIENCE)

### Spotify API (Free Tier)
1. Go to https://developer.spotify.com/dashboard
2. Create new app: "DropZone"
3. Copy Client ID and Client Secret
4. Add Redirect URI (for future OAuth): `https://dropzone-api.onrender.com/api/auth/spotify/callback`

---

## ⚠️ Common Issues

### Issue: "Service fails to start"
**Check:** Render logs → Environment variables properly set?

### Issue: "Database connection fails"
**Check:** DATABASE_URL includes `?sslmode=require`

### Issue: "CORS errors in browser"
**Check:** CORS_ORIGINS matches exact frontend URL (with https://)

### Issue: "Auth0 login fails"
**Check:** Callback URLs configured in Auth0 dashboard

---

## 📊 Monitoring

**Render Dashboard:**
- Build logs
- Deploy logs
- Runtime logs
- Metrics (CPU/Memory)

**Health Endpoints:**
- Backend: https://dropzone-api.onrender.com/health
- Database: Check via backend `/health` endpoint (add DB check later)

---

## 🎉 Success Criteria

- [ ] Backend API responds at /health
- [ ] Swagger docs load at /docs
- [ ] Web dashboard loads (may show API errors until Auth0 configured)
- [ ] No build errors in Render logs

After deployment, web-frontend-lead and ios-app-lead will integrate and test the live API.
