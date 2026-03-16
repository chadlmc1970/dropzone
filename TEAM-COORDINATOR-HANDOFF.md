# DropZone Project - Agent Team Coordinator Handoff

**Date:** March 16, 2026
**Purpose:** Migrate 3-Claude parallel development to agent teams feature
**Project:** DropZone - AI-powered DJ mixing app (Web + iOS + Backend API)

---

## 🎯 Project Overview

**DropZone** is a DJ mixing application with:
- **Web Frontend:** React/Next.js dashboard
- **iOS App:** SwiftUI native app
- **Backend API:** FastAPI with Auth0 + Spotify OAuth integration

**Business Goal:** Allow DJs to mix tracks from Spotify with AI-powered transitions, save mixes, and use autopilot mode for automated DJ sets.

**Tech Stack:**
- Backend: FastAPI, SQLAlchemy, Neon PostgreSQL, Auth0, Spotify API
- Web: Next.js 14, TailwindCSS, TypeScript
- iOS: SwiftUI, Swift 5.9, async/await
- Deployment: Render (all 3 services)

---

## 👥 Current Team Structure (3 Claudes)

### Claude 1 - Backend Lead (YOU - Currently Active)
**Role:** Build FastAPI backend with Auth0 + Spotify integration
**Status:** 43% complete (Tasks 1-6 done, Tasks 7-15 remaining)
**Working Directory:** `/Users/I870089/dropzone/backend/`

**Key Files:**
- Plan: `/Users/I870089/.claude/plans/cuddly-hopping-thompson.md`
- Status: `/Users/I870089/dropzone/STATUS-UPDATE-BACKEND-MARCH-15.md`
- Context: `/Users/I870089/dropzone/CONTEXT-CLAUDE-1-BACKEND.md`
- Main app: `/Users/I870089/dropzone/backend/app/main.py`
- Tests: `/Users/I870089/dropzone/backend/tests/`

**Completed:**
- ✅ Task 1: Project structure (config, requirements, .env)
- ✅ Task 2: Database models (User, Mix, Preset, SpotifyCache, AutopilotSession)
- ✅ Task 3: FastAPI app initialization with CORS
- ✅ Task 4: Spotify service (search tracks, get track details)
- ✅ Task 5: Tracks API endpoints (`GET /api/tracks/search`, `GET /api/tracks/{id}`)
- ✅ Task 6: Auth0Service with JWT token verification
- ✅ 10/10 tests passing

**In Progress:**
- 🚧 Task 7: Auth endpoints (test file created: `backend/tests/test_auth_api.py`)
  - Need: `POST /api/auth/callback`
  - Need: `GET /api/auth/me`
  - Need: `POST /api/auth/logout`

**Remaining:**
- Task 8: JWT middleware for protected routes
- Task 9-10: Playlists API (GET, POST playlists)
- Task 11-12: Mixes, Presets, Autopilot APIs (optional)
- Task 13: Create Dockerfile
- Task 14-15: Deploy to Render → `https://dropzone-api.onrender.com`

**Resume Command:**
```bash
cd /Users/I870089/dropzone/backend
source venv/bin/activate
PYTHONPATH=/Users/I870089/dropzone:$PYTHONPATH python -m pytest tests/ -v
# Should show: 10/10 tests passing
# Next: Complete Task 7 auth callback endpoint (TDD workflow)
```

---

### Claude 2 - Web Frontend Lead
**Role:** Build Next.js web dashboard
**Status:** ✅ 100% COMPLETE - Waiting for backend deployment
**Working Directory:** `/Users/I870089/dropzone/web/`

**Key Files:**
- Plan: `/Users/I870089/docs/superpowers/plans/2026-03-15-dropzone-web-frontend.md`
- Status: `/Users/I870089/dropzone/STATUS-UPDATE-CLAUDE-2-WEB.md`
- API Client: `/Users/I870089/dropzone/web/src/services/api.ts`
- Production Build: Ready (231KB JS, 6KB CSS)

**Completed:**
- ✅ All 11 tasks complete
- ✅ Pages: Login, Dashboard, Mix, Track Search, Library
- ✅ Components: MixingConsole, WaveformVisualizer, TrackSearch
- ✅ API client ready (currently using mock data)
- ✅ Production build successful

**Blocked On:**
- ⏸️ Backend deployment to `https://dropzone-api.onrender.com`
- ⏸️ Auth endpoints (`POST /api/auth/callback`, `GET /api/auth/me`)

**Action When Unblocked:**
1. Update `API_BASE_URL` in `web/src/services/api.ts`
2. Deploy to Render → `https://dropzone-dashboard.onrender.com`
3. Test authentication flow
4. Report integration status

---

### Claude 3 - iOS App Lead
**Role:** Build SwiftUI iOS app
**Status:** ✅ 100% COMPLETE - Waiting for backend deployment
**Working Directory:** `/Users/I870089/dropzone/ios/`

**Key Files:**
- Plan: `/Users/I870089/docs/superpowers/plans/2026-03-15-dropzone-ios-app.md`
- Status: `/Users/I870089/dropzone/STATUS-CLAUDE-3-IOS-COMPLETE.md`
- API Client: `/Users/I870089/dropzone/ios/DropZone/Services/APIClient.swift`
- Mock Flag: `useMock = true` (ready to flip to `false`)

**Completed:**
- ✅ All 10 tasks complete
- ✅ Views: LoginView, DashboardView, MixingView, LibraryView
- ✅ Services: APIClient, AuthManager, AudioEngineManager
- ✅ Mock data working perfectly

**Blocked On:**
- ⏸️ Backend deployment to `https://dropzone-api.onrender.com`

**Action When Unblocked:**
1. Change `useMock = false` in `APIClient.swift`
2. Test login → track search → mix creation flow
3. Report integration status (ETA: 2 minutes)

---

## 🔄 Migration to Agent Teams

### Recommended Team Structure

**Option 1: Continue Current Structure (3 Agents)**
```
Team Lead (You/Coordinator)
├── Backend Agent (Resume Claude 1's work)
├── Web Frontend Agent (On standby, ready to deploy)
└── iOS App Agent (On standby, ready to deploy)
```

**Option 2: Backend Focus (Current Priority)**
```
Team Lead (You/Coordinator)
└── Backend Agent (Complete Tasks 7-15, notify other teams when done)
    ├── Auth endpoints (Task 7-8)
    ├── Playlists API (Task 9-10)
    └── Deploy to Render (Task 13-15)
```

**Option 3: Parallel Completion (Fast Path)**
```
Team Lead (You/Coordinator)
├── Backend Auth Agent (Tasks 7-8: Auth endpoints + middleware)
├── Backend Playlists Agent (Tasks 9-10: Playlists API)
└── Backend Deployment Agent (Tasks 13-15: Dockerfile + Render deploy)
```

---

## 📋 Spawn Commands for Agent Teams

### Spawn Backend Agent (Resume Claude 1)
```
Create a backend development agent to continue DropZone FastAPI backend.

Role: Backend Lead
Working Directory: /Users/I870089/dropzone/backend/
Plan: /Users/I870089/.claude/plans/cuddly-hopping-thompson.md
Context: /Users/I870089/dropzone/CONTEXT-CLAUDE-1-BACKEND.md

Current Status:
- Tasks 1-6 complete (10/10 tests passing)
- Task 7 in progress (auth endpoints)
- Use TDD workflow (test first, watch fail, implement, pass)

Next Steps:
1. Complete Task 7: Auth endpoints (POST /api/auth/callback, GET /api/auth/me, POST /api/auth/logout)
2. Complete Task 8: JWT middleware
3. Complete Task 9-10: Playlists API
4. Complete Task 13-15: Deploy to Render
5. Notify web and iOS teams when deployed

Resume: cd /Users/I870089/dropzone/backend && source venv/bin/activate && pytest tests/ -v
```

### Spawn Web Frontend Agent (Standby)
```
Create a web frontend agent for DropZone React dashboard.

Role: Web Frontend Lead
Working Directory: /Users/I870089/dropzone/web/
Status: COMPLETE - Waiting for backend deployment

Task: Wait for backend agent to notify when API is deployed at https://dropzone-api.onrender.com
Then:
1. Update API_BASE_URL in web/src/services/api.ts
2. Deploy to Render
3. Test authentication flow
4. Report integration status

Current State: Production build ready (231KB JS, 6KB CSS)
```

### Spawn iOS App Agent (Standby)
```
Create an iOS app agent for DropZone SwiftUI app.

Role: iOS App Lead
Working Directory: /Users/I870089/dropzone/ios/
Status: COMPLETE - Waiting for backend deployment

Task: Wait for backend agent to notify when API is deployed at https://dropzone-api.onrender.com
Then:
1. Change useMock = false in ios/DropZone/Services/APIClient.swift
2. Test login → track search → mix creation
3. Report integration status (ETA: 2 minutes)

Current State: Mock data working, ready to flip switch
```

---

## 🔑 Critical Information

### Authentication Architecture
- **Auth0:** User authentication (login/logout)
- **Spotify OAuth:** Spotify API access (playlists, tracks)
- **Hybrid approach:** Auth0 for users + Spotify tokens for API calls

### Database
- **Provider:** Neon PostgreSQL
- **Models:** User (with auth0_id), Mix, Preset, SpotifyCache, AutopilotSession
- **Connection:** Via SQLAlchemy, connection string in .env

### Deployment Targets
- **Backend:** `https://dropzone-api.onrender.com`
- **Web:** `https://dropzone-dashboard.onrender.com`
- **iOS:** TestFlight (future)

### Git Repository
- **Remote:** `https://github.com/chadlmc1970/dropzone.git`
- **Branch:** `main`
- **Last Commit:** `6333fba Task 6: Auth0Service with token verification (TDD)`

### Environment Variables Needed (Render)
```bash
# Backend
DATABASE_URL=<neon-postgres-connection-string>
JWT_SECRET_KEY=<generate-with-openssl-rand-hex-32>
SPOTIFY_CLIENT_ID=<from-spotify-developer-dashboard>
SPOTIFY_CLIENT_SECRET=<from-spotify-developer-dashboard>
AUTH0_DOMAIN=<auth0-tenant-domain>
AUTH0_CLIENT_ID=<auth0-client-id>
AUTH0_CLIENT_SECRET=<auth0-client-secret>
AUTH0_AUDIENCE=<auth0-api-audience>
CORS_ORIGINS=https://dropzone-dashboard.onrender.com
FRONTEND_URL=https://dropzone-dashboard.onrender.com
```

---

## 📊 Progress Summary

| Team | Tasks | Status | ETA |
|------|-------|--------|-----|
| Backend | 6.5/15 done | 🚧 In Progress | 4-5 hours |
| Web Frontend | 11/11 done | ✅ Complete | Ready |
| iOS App | 10/10 done | ✅ Complete | Ready |

**Overall:** 27.5/36 tasks complete (76%)

**Critical Path:** Backend deployment → Frontend/iOS integration (< 30 min after backend deploys)

---

## 🚀 Recommended Workflow

### Phase 1: Backend Completion (4-5 hours)
1. **Morning:** Auth endpoints + middleware (Tasks 7-8) - 2 hours
2. **Midday:** Playlists API (Tasks 9-10) - 1 hour
3. **Afternoon:** Deploy to Render (Tasks 13-15) - 1 hour

### Phase 2: Integration (30 minutes)
1. Backend agent notifies web + iOS agents: "Backend live!"
2. Web agent updates API URL, deploys to Render
3. iOS agent flips mock flag, tests integration
4. All agents report status

### Phase 3: Validation (30 minutes)
1. Test full user flow: Login → Search tracks → Create mix → Save
2. Verify all 3 services communicating correctly
3. Report to user: "DropZone fully deployed!"

---

## 🎯 Success Criteria

**Backend Deployment:**
- [ ] All auth endpoints working (callback, me, logout)
- [ ] JWT middleware protecting routes
- [ ] Playlists API functional
- [ ] Deployed to Render with health checks passing
- [ ] All tests passing (estimated 15-20 tests)

**Integration:**
- [ ] Web frontend can authenticate with Auth0
- [ ] iOS app can search tracks and create mixes
- [ ] All 3 services deployed and communicating

**Handoff Complete:**
- [ ] User can access full application at production URLs
- [ ] All documentation updated
- [ ] No blocking issues

---

## 📞 Communication Protocol

**When Backend Deploys:**
```
Subject: 🚀 Backend Deployed - Ready for Integration
To: Web Agent, iOS Agent

Backend is live at: https://dropzone-api.onrender.com
Health check: GET /health → {"status": "healthy"}

Web Agent: Update API_BASE_URL and deploy
iOS Agent: Change useMock = false and test

ETA for integration: 30 minutes
```

**When Integration Complete:**
```
Subject: ✅ DropZone Fully Deployed
To: User (chadlmc1970)

All services live:
- Backend: https://dropzone-api.onrender.com
- Web: https://dropzone-dashboard.onrender.com
- iOS: Mock disabled, testing complete

Status: Ready for use
```

---

## 🛠️ Tools & References

**Plans:**
- Backend: `/Users/I870089/.claude/plans/cuddly-hopping-thompson.md`
- Web: `/Users/I870089/docs/superpowers/plans/2026-03-15-dropzone-web-frontend.md`
- iOS: `/Users/I870089/docs/superpowers/plans/2026-03-15-dropzone-ios-app.md`

**Status Docs:**
- Backend: `/Users/I870089/dropzone/STATUS-UPDATE-BACKEND-MARCH-15.md`
- Web: `/Users/I870089/dropzone/STATUS-UPDATE-CLAUDE-2-WEB.md`
- iOS: `/Users/I870089/dropzone/STATUS-CLAUDE-3-IOS-COMPLETE.md`

**Key Directories:**
- Backend: `/Users/I870089/dropzone/backend/`
- Web: `/Users/I870089/dropzone/web/`
- iOS: `/Users/I870089/dropzone/ios/`
- Docs: `/Users/I870089/dropzone/docs/`

---

## ⚡ Quick Start for Team Coordinator

**Immediate Action:**
```bash
# 1. Verify backend status
cd /Users/I870089/dropzone/backend
source venv/bin/activate
pytest tests/ -v
# Expected: 10/10 passing

# 2. Spawn backend agent to complete Tasks 7-15
# Agent will use TDD workflow, commit after each task

# 3. When backend deploys, spawn web + iOS agents
# They'll update configs and deploy in parallel

# 4. Report completion to user
```

**Estimated Total Time:** 5-6 hours (4-5 backend, 0.5 integration, 0.5 validation)

---

**End of Handoff Document**
**Coordinator:** Use this to spawn appropriate agents and coordinate deployment
**Goal:** Get DropZone fully deployed and functional by end of day March 16, 2026
