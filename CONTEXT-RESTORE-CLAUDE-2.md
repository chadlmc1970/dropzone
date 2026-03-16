# CONTEXT RESTORE: Claude 2 (Web Frontend Agent)

**Project:** DropZone AI DJ Platform
**Role:** Web Frontend Lead (React + Redux + TypeScript)
**Date:** March 15, 2026, 8:20 PM
**Status:** ✅ ALL TASKS COMPLETE → ⏸️ HOLD (waiting for backend)

---

## WHO AM I

**Claude 2** - Web Frontend implementation specialist for DropZone project.

**Working with:**
- Claude 1: Backend API (FastAPI + PostgreSQL + Spotify)
- Claude 3: iOS monitoring app (SwiftUI)

---

## WHAT I BUILT (5 hours, 11 tasks, DONE)

### Location
`/Users/I870089/dropzone/web/` - Vite + React 19 + TypeScript + Tailwind v4

### Tech Stack
- React 19.2 + Redux Toolkit 2.11
- TypeScript 5.9 (verbatimModuleSyntax enabled)
- Tailwind CSS v4 (@tailwindcss/postcss)
- Axios for API calls
- Web Audio API for mixing
- Spotify Web Playback SDK integration

### What Works
1. ✅ Vite project init
2. ✅ Redux store (decks, mixer, UI slices)
3. ✅ API service (`src/services/api.ts` - JWT auth, axios interceptors)
4. ✅ Spotify SDK hooks
5. ✅ Web Audio engine (EQ, crossfader, effects)
6. ✅ DJ Controller UI (Pioneer CDJ aesthetic: black/cyan/orange)
7. ✅ Interactive Jog Wheels (rotation, scratch detection)
8. ✅ Canvas Waveform (beat markers, playhead, seek)
9. ✅ Crossfader + 3-band EQ per deck
10. ✅ Track Search modal (Spotify integration UI)
11. ✅ TypeScript build passing (231KB JS, 6KB CSS gzipped)

### Build Output
```
npm run build → SUCCESS
dist/index.html:     0.45 kB (gzip: 0.29 kB)
dist/assets/*.css:   6.05 kB (gzip: 1.66 kB)
dist/assets/*.js:  231.20 kB (gzip: 72.60 kB)
```

---

## KEY FILES

**API Client:** `/Users/I870089/dropzone/web/src/services/api.ts`
- Axios instance with JWT Bearer token auth
- Calls: `/api/tracks/search`, `/api/auth/login`, `/api/playlists`

**Types:** `/Users/I870089/dropzone/web/src/types/index.ts`
- Track interface (matches Spotify schema)
- DeckState, MixerState, UIState

**Redux Store:** `/Users/I870089/dropzone/web/src/store/`
- `decksSlice.ts` - Deck A/B state (track, playing, position, tempo, cue points)
- `mixerSlice.ts` - Crossfader, EQ, volume, effects
- `uiSlice.ts` - Mode (manual/autopilot), active deck, search modal

**Components:** `/Users/I870089/dropzone/web/src/components/`
- `DJController/` - Main layout
- `Deck/` - Deck, JogWheel, Waveform
- `Mixer/` - Crossfader, ChannelStrip, EffectsRack
- `TrackSearch/` - Search modal

**Docs:**
- `DEPLOY.md` - Deployment guide
- `SESSION_HANDOFF.md` - Task completion summary
- `STATUS-UPDATE-CLAUDE-2-WEB.md` - Current status for Claude 1
- `CONTEXT-CLAUDE-1-BACKEND.md` - Context prompt for Claude 1

---

## WHAT I'M WAITING FOR

### Backend API (Claude 1 is building this)

**Status:** Tasks 1-2 done, Tasks 3-15 in progress

**Need these endpoints BEFORE I deploy:**

1. `GET /health` → `{"status": "healthy"}`
2. `GET /api/tracks/search?q={query}` → `{"tracks": [Track...]}`
3. `GET /api/tracks/{id}` → `Track`
4. `POST /api/auth/login` → `{"access_token": "...", "token_type": "bearer"}`
5. `GET /api/playlists` → `{"playlists": [...]}`

**Expected backend URL:** `https://dropzone-api.onrender.com`

---

## DEPLOYMENT PLAN (When Backend Ready)

### Step 1: Backend Deploys First
- Claude 1 finishes Tasks 3-15
- Deploys to Render Web Service
- Tests endpoints work
- **Pings me with green light**

### Step 2: I Deploy Frontend (10 min)
```bash
# Create GitHub repo
git remote set-url origin https://github.com/chadlmc1970/dropzone.git
git push -u origin main

# Deploy to Render Static Site
# Build command: cd web && npm install && npm run build
# Publish directory: web/dist
# Env vars:
#   VITE_API_URL=https://dropzone-api.onrender.com
#   VITE_SPOTIFY_CLIENT_ID=c7542388e8dc4ee18d0496383e1d0443
```

**Frontend URL:** `https://dropzone.onrender.com`

### Step 3: Test Together
- Load app, search tracks, test mixing features

---

## COMMITS READY TO PUSH

```
a444428 - status: Claude 2 complete status update (latest)
02ca44b - docs: context prompt for Claude 1
49bdddf - docs: session handoff note
f83377f - docs: deployment guide
a93d2ca - fix: TypeScript build errors (Tailwind v4, type imports, API service)
```

All commits in `/Users/I870089/dropzone/` on `main` branch.

---

## IMPORTANT TECHNICAL NOTES

### TypeScript Fixes Applied
- Added missing `src/services/api.ts` (axios client)
- Fixed type-only imports (`import type { Track }` not `import { Track }`)
- Added `createSlice` imports to all Redux slices
- Fixed `animationRef` type: `useRef<number | null>(null)`
- Tailwind v4: uses `@tailwindcss/postcss` instead of `tailwindcss` in postcss.config.js
- Commented out unused `reverbNode`/`delayNode` in audioEngine

### Auth Flow
```typescript
// Frontend stores JWT in localStorage
localStorage.setItem('auth_token', token)

// All API requests include header
Authorization: Bearer {token}

// 401 response → clear token, redirect to login
```

### API Client Config
```typescript
// src/services/api.ts
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
```

---

## CURRENT STATUS

**Mode:** ⏸️ HOLD
**Reason:** Waiting for backend deployment
**ETA:** Backend ~2-3 hours, then I deploy in 10 min
**Next Action:** Deploy to Render when Claude 1 gives green light

---

## QUICK COMMANDS

```bash
# Navigate to frontend
cd /Users/I870089/dropzone/web

# Dev server
npm run dev  # http://localhost:5173

# Production build
npm run build  # outputs to dist/

# Check status
git status
git log --oneline -5
```

---

## MEMORY.MD RULES (FROM CONTEXT)

- **Never suggest localhost** - Always use production URLs
- **Migration Studio:** https://migration-studio-pqor.onrender.com
- **CatchWeight:** https://catchweight-dashboard.onrender.com
- **OpenClaw:** EC2 at http://18.216.179.28:3000
- **DropZone:** Will be https://dropzone.onrender.com (not deployed yet)

---

## RESUME ACTIONS

When backend is ready:
1. ✅ Confirm backend live at `https://dropzone-api.onrender.com`
2. ✅ Test `/health` endpoint
3. ✅ Create GitHub repo (or confirm exists)
4. ✅ Push code: `git push -u origin main`
5. ✅ Deploy to Render Static Site
6. ✅ Configure `VITE_API_URL` env var
7. ✅ Test frontend at `https://dropzone.onrender.com`
8. ✅ Verify API calls work (search, auth, playlists)

**I am production-ready. Just waiting for backend.** 🚀

---

**Last updated:** 2026-03-15 20:20:00
**Context token usage:** 60%+ → Restore with this prompt
