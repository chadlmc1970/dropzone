# Agent Team Instructions for DropZone Project

**Coordinator:** Use these specific instructions to spawn and manage the 3-agent team for DropZone deployment.

**Date:** March 16, 2026
**Goal:** Complete backend (Tasks 7-15), integrate web + iOS, deploy all services

---

## 🎯 Team Strategy

### Recommended Approach: **Sequential with Parallel Integration**

1. **Spawn Backend Agent** → Complete Tasks 7-15 (4-5 hours)
2. **When backend deploys** → Spawn Web + iOS agents in parallel (30 min)
3. **Validation** → All agents report integration status

**Rationale:** Web and iOS are 100% complete and blocked on backend. Focus all resources on backend completion first, then quick parallel integration.

---

## 🤖 Agent 1: Backend Lead (Priority 1 - Spawn Immediately)

### Agent Configuration
```yaml
name: backend-lead
role: FastAPI Backend Developer
working_directory: /Users/I870089/dropzone/backend/
tools_needed: [Read, Write, Edit, Bash, Glob, Grep, TodoWrite]
subprocess_access: true
git_access: true
```

### Spawn Command
```
Spawn agent named "backend-lead" to complete DropZone FastAPI backend.

Working Directory: /Users/I870089/dropzone/backend/

Context:
- Read plan: /Users/I870089/.claude/plans/cuddly-hopping-thompson.md
- Read status: /Users/I870089/dropzone/STATUS-UPDATE-BACKEND-MARCH-15.md
- Read context: /Users/I870089/dropzone/CONTEXT-CLAUDE-1-BACKEND.md

Current Status:
✅ Tasks 1-6 complete (10/10 tests passing)
🚧 Task 7 in progress (auth endpoints - test file created)
⏳ Tasks 8-15 remaining

Your Mission:
Complete Tasks 7-15 using strict TDD workflow (test first, watch fail, implement, pass).

Priority Order:
1. Task 7: Auth endpoints (POST /api/auth/callback, GET /api/auth/me, POST /api/auth/logout)
2. Task 8: JWT middleware for protected routes
3. Task 9-10: Playlists API (GET /api/playlists, GET /api/playlists/{id}, POST /api/playlists)
4. Task 11-12: OPTIONAL - Mixes, Presets, Autopilot APIs (skip if time-constrained)
5. Task 13: Create Dockerfile
6. Task 14-15: Deploy to Render → https://dropzone-api.onrender.com

Critical Rules:
- MUST use TDD: Write test first, watch it fail, implement, watch it pass
- MUST commit after each task completion
- MUST use virtual environment: source venv/bin/activate
- MUST run pytest after each implementation: PYTHONPATH=/Users/I870089/dropzone:$PYTHONPATH python -m pytest tests/ -v
- MUST notify coordinator when backend is deployed

Resume Command:
cd /Users/I870089/dropzone/backend
source venv/bin/activate
PYTHONPATH=/Users/I870089/dropzone:$PYTHONPATH python -m pytest tests/ -v
# Should show: 10/10 passing
# Next: Complete Task 7 - auth callback endpoint test already exists at tests/test_auth_api.py

When Complete:
Notify coordinator: "Backend deployed at https://dropzone-api.onrender.com. Health check passing. Ready for web and iOS integration."
```

### Expected Deliverables from Backend Agent
- [ ] Auth endpoints working (`/api/auth/callback`, `/api/auth/me`, `/api/auth/logout`)
- [ ] JWT middleware protecting routes
- [ ] Playlists API functional (`/api/playlists` endpoints)
- [ ] Dockerfile created
- [ ] Deployed to Render with environment variables set
- [ ] All tests passing (estimated 15-20 tests)
- [ ] Git commits for each task

### Key Files Backend Agent Will Create/Modify
- `backend/app/api/auth.py` - Auth endpoints
- `backend/app/middleware/auth.py` - JWT middleware
- `backend/app/api/playlists.py` - Playlists endpoints
- `backend/tests/test_auth_api.py` - Auth tests (exists, needs completion)
- `backend/tests/test_playlists_api.py` - Playlists tests
- `backend/Dockerfile` - Container definition
- `backend/app/main.py` - Register new routers

---

## 🤖 Agent 2: Web Frontend Lead (Priority 2 - Spawn When Backend Deploys)

### Agent Configuration
```yaml
name: web-frontend-lead
role: Next.js Web Developer
working_directory: /Users/I870089/dropzone/web/
tools_needed: [Read, Write, Edit, Bash, Glob]
subprocess_access: true
git_access: true
```

### Spawn Command
```
Spawn agent named "web-frontend-lead" to integrate and deploy DropZone React web dashboard.

Working Directory: /Users/I870089/dropzone/web/

Context:
- Read plan: /Users/I870089/docs/superpowers/plans/2026-03-15-dropzone-web-frontend.md
- Read status: /Users/I870089/dropzone/STATUS-UPDATE-CLAUDE-2-WEB.md

Current Status:
✅ All 11 tasks complete
✅ Production build ready (231KB JS, 6KB CSS)
⏸️ Waiting for backend deployment

Your Mission:
Backend is now live at https://dropzone-api.onrender.com. Integrate with real API and deploy.

Tasks:
1. Update API_BASE_URL in web/src/services/api.ts
   - Change from localhost to https://dropzone-api.onrender.com

2. Test authentication flow locally
   - Run: npm run dev
   - Test: Login → Dashboard → Track Search → Mix Creation
   - Verify API calls work

3. Build for production
   - Run: npm run build
   - Verify no errors

4. Deploy to Render
   - Push to GitHub: git push origin main
   - Configure Render Web Service (if not exists)
   - Set environment variables:
     * NEXT_PUBLIC_API_URL=https://dropzone-api.onrender.com
     * NEXT_PUBLIC_AUTH0_DOMAIN=<from backend>
     * NEXT_PUBLIC_AUTH0_CLIENT_ID=<from backend>
   - Deploy target: https://dropzone-dashboard.onrender.com

5. Test production deployment
   - Visit: https://dropzone-dashboard.onrender.com
   - Test full user flow
   - Verify all API calls work

When Complete:
Notify coordinator: "Web frontend deployed at https://dropzone-dashboard.onrender.com. Authentication flow tested. All features working."
```

### Expected Deliverables from Web Agent
- [ ] API client updated with production URL
- [ ] Local testing completed successfully
- [ ] Production build successful
- [ ] Deployed to Render
- [ ] Integration test passed (login → search → mix)
- [ ] Git commit with production config

### Key Files Web Agent Will Modify
- `web/src/services/api.ts` - Update API_BASE_URL
- `web/.env.production` - Production environment variables (if needed)

---

## 🤖 Agent 3: iOS App Lead (Priority 2 - Spawn When Backend Deploys)

### Agent Configuration
```yaml
name: ios-app-lead
role: SwiftUI iOS Developer
working_directory: /Users/I870089/dropzone/ios/
tools_needed: [Read, Write, Edit, Bash, Glob]
subprocess_access: true
git_access: true
```

### Spawn Command
```
Spawn agent named "ios-app-lead" to integrate DropZone iOS app with production backend.

Working Directory: /Users/I870089/dropzone/ios/

Context:
- Read plan: /Users/I870089/docs/superpowers/plans/2026-03-15-dropzone-ios-app.md
- Read status: /Users/I870089/dropzone/STATUS-CLAUDE-3-IOS-COMPLETE.md

Current Status:
✅ All 10 tasks complete
✅ Mock API working perfectly
⏸️ Waiting for backend deployment

Your Mission:
Backend is now live at https://dropzone-api.onrender.com. Switch from mock to real API and test integration.

Tasks:
1. Update API client configuration
   - File: ios/DropZone/Services/APIClient.swift
   - Change: useMock = false
   - Change: baseURL = "https://dropzone-api.onrender.com"

2. Build the app in Xcode
   - Open: ios/DropZone.xcodeproj
   - Build for: iPhone Simulator (iOS 17.0+)
   - Verify no build errors

3. Test integration flow (10-minute test)
   - Test 1: Login with Auth0
   - Test 2: Search for tracks (e.g., "daft punk")
   - Test 3: Load track into mixer
   - Test 4: Create and save a mix
   - Test 5: View saved mixes in library

4. Document results
   - Screenshot successful flow
   - Note any API errors or issues
   - Verify all mock data is now real data

5. Commit changes
   - Commit: "Switch to production API"
   - Push to GitHub

When Complete:
Notify coordinator: "iOS app integrated with production backend. All 5 integration tests passed. Mock data disabled. App ready for TestFlight deployment."
```

### Expected Deliverables from iOS Agent
- [ ] Mock flag disabled (`useMock = false`)
- [ ] Production API URL configured
- [ ] Xcode build successful
- [ ] Integration tests passed (5/5)
- [ ] Screenshots of working app
- [ ] Git commit with production config

### Key Files iOS Agent Will Modify
- `ios/DropZone/Services/APIClient.swift` - Disable mock, set production URL
- `ios/DropZone/Config.xcconfig` - Production configuration (if needed)

---

## 📋 Coordinator Workflow

### Phase 1: Backend Completion (Immediate)

```bash
# Step 1: Spawn backend agent
<spawn backend-lead agent with instructions above>

# Step 2: Monitor progress
# Backend agent should report after each task:
# - "Task 7 complete: Auth endpoints (12/12 tests passing)"
# - "Task 8 complete: JWT middleware (14/14 tests passing)"
# - "Task 9-10 complete: Playlists API (18/18 tests passing)"
# - "Task 13 complete: Dockerfile created"
# - "Task 14-15 complete: Deployed to Render"

# Step 3: Verify backend deployment
# When backend agent reports deployment complete:
curl https://dropzone-api.onrender.com/health
# Expected: {"status": "healthy"}
```

### Phase 2: Frontend Integration (After Backend Deploys)

```bash
# Step 1: Spawn web and iOS agents IN PARALLEL
<spawn web-frontend-lead agent with instructions above>
<spawn ios-app-lead agent with instructions above>

# Step 2: Monitor both agents
# Web agent timeline: ~20-30 minutes
# iOS agent timeline: ~10-15 minutes

# Step 3: Verify integrations
# Web: https://dropzone-dashboard.onrender.com
# iOS: Check agent's test report
```

### Phase 3: Validation & Completion

```bash
# Step 1: Verify all services
curl https://dropzone-api.onrender.com/health
curl https://dropzone-api.onrender.com/api/tracks/search?q=test

# Step 2: Test web frontend
open https://dropzone-dashboard.onrender.com
# - Login should work
# - Track search should work
# - Mix creation should work

# Step 3: Collect agent reports
# Backend agent: Deployment summary + test results
# Web agent: Integration test results
# iOS agent: Integration test results

# Step 4: Report to user
"DropZone fully deployed and operational:
- Backend: https://dropzone-api.onrender.com (✅ healthy)
- Web: https://dropzone-dashboard.onrender.com (✅ deployed)
- iOS: Mock disabled, integration tests passed (✅ ready)

All services communicating. Project complete."
```

---

## 🚨 Error Handling

### If Backend Agent Gets Stuck

**Symptoms:**
- Tests not passing after multiple attempts
- Deployment errors on Render
- Auth0/Spotify credentials issues

**Actions:**
1. Backend agent should report the specific error
2. Coordinator reviews the issue
3. Options:
   - Provide missing credentials/config
   - Adjust the plan (skip optional tasks 11-12)
   - Debug with backend agent using Read/Grep tools

### If Web Agent Can't Deploy

**Symptoms:**
- Build errors
- API connection failures
- Authentication not working

**Actions:**
1. Web agent should test locally first before deploying
2. If API calls fail, verify backend health endpoint
3. Check CORS configuration in backend
4. Verify Auth0 callback URLs configured correctly

### If iOS Agent Integration Fails

**Symptoms:**
- Build errors in Xcode
- API 401 errors (auth issues)
- Network errors

**Actions:**
1. iOS agent should report specific error messages
2. Verify backend `/api/auth/callback` is working
3. Check iOS app Auth0 configuration
4. Fallback: Keep `useMock = true` temporarily, fix auth, retry

---

## 🎯 Success Metrics

### Backend Agent Success
- [ ] 18+ tests passing (auth + playlists + existing)
- [ ] Deployed to Render
- [ ] Health endpoint responding
- [ ] Auth endpoints returning JWT tokens
- [ ] Playlists endpoint returning data

### Web Agent Success
- [ ] Production build successful (no errors)
- [ ] Deployed to Render
- [ ] Can login via Auth0
- [ ] Can search tracks
- [ ] Can create and save mixes

### iOS Agent Success
- [ ] Xcode build successful
- [ ] Mock disabled
- [ ] 5/5 integration tests passed
- [ ] Real data showing in app
- [ ] No network errors

### Overall Project Success
- [ ] All 3 services deployed
- [ ] End-to-end user flow works
- [ ] No blocking errors
- [ ] User can access DropZone and create mixes

---

## 📊 Estimated Timeline

| Phase | Agent | Duration | Status |
|-------|-------|----------|--------|
| Backend Auth | backend-lead | 2 hours | Pending |
| Backend Playlists | backend-lead | 1 hour | Pending |
| Backend Deploy | backend-lead | 1 hour | Pending |
| **Backend Total** | | **4 hours** | |
| Web Integration | web-frontend-lead | 30 min | Waiting |
| iOS Integration | ios-app-lead | 15 min | Waiting |
| **Integration Total** | | **30 min** | (Parallel) |
| Validation | coordinator | 30 min | Waiting |
| **Grand Total** | | **5 hours** | |

---

## 🔑 Critical Environment Variables

### Backend (Render)
```bash
DATABASE_URL=postgresql://...neon.tech/dropzone
JWT_SECRET_KEY=<generate: openssl rand -hex 32>
SPOTIFY_CLIENT_ID=<from spotify dashboard>
SPOTIFY_CLIENT_SECRET=<from spotify dashboard>
SPOTIFY_REDIRECT_URI=https://dropzone-api.onrender.com/api/auth/spotify/callback
AUTH0_DOMAIN=<tenant>.auth0.com
AUTH0_CLIENT_ID=<from auth0 dashboard>
AUTH0_CLIENT_SECRET=<from auth0 dashboard>
AUTH0_AUDIENCE=https://dropzone-api.onrender.com
CORS_ORIGINS=https://dropzone-dashboard.onrender.com
FRONTEND_URL=https://dropzone-dashboard.onrender.com
```

### Web (Render)
```bash
NEXT_PUBLIC_API_URL=https://dropzone-api.onrender.com
NEXT_PUBLIC_AUTH0_DOMAIN=<same as backend>
NEXT_PUBLIC_AUTH0_CLIENT_ID=<from auth0 dashboard>
NEXT_PUBLIC_AUTH0_CALLBACK_URL=https://dropzone-dashboard.onrender.com/callback
```

---

## 🚀 Quick Start Command for Coordinator

```bash
# Immediate action - spawn backend agent
cd /Users/I870089/dropzone

# Read the handoff document
cat TEAM-COORDINATOR-HANDOFF.md

# Spawn backend agent with Phase 1 instructions
# Agent will:
# 1. Resume from Task 7 (tests already passing 10/10)
# 2. Complete Tasks 7-8-9-10 with TDD
# 3. Create Dockerfile
# 4. Deploy to Render
# 5. Notify coordinator when done

# Wait for backend completion notification
# Then spawn web + iOS agents in parallel with Phase 2 instructions
```

---

**End of Agent Team Instructions**

**Coordinator:** Use these specific spawn commands to create and manage the 3-agent team. Backend agent is priority 1 (spawn immediately), web and iOS agents are priority 2 (spawn when backend deploys).
