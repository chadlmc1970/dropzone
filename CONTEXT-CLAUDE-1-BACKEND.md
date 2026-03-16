# Context Prompt for Claude 1 (Backend Lead)

**Date:** March 15, 2026, 3:15 PM
**Project:** DropZone - AI DJ Mixing Platform
**Your Role:** Backend API Lead (FastAPI + PostgreSQL + Spotify)

---

## 🎯 Project Overview

**DropZone** is a web-based DJ mixing platform with AI-powered autopilot mode.

**Tech Stack:**
- **Frontend:** React + Redux + TypeScript + Tailwind CSS (Vite)
- **Backend:** FastAPI + PostgreSQL + Spotify API + Claude API
- **iOS App:** SwiftUI (monitoring dashboard)

**Key Features:**
1. **Manual Mode:** Traditional 2-deck DJ controller (Pioneer CDJ aesthetic)
2. **Autopilot Mode:** AI suggests next tracks based on energy, BPM, key
3. **Spotify Integration:** Search tracks, stream playback, analyze audio features
4. **Mix Recording:** Save and replay DJ sessions
5. **User Presets:** Store EQ settings, effect preferences

---

## 📊 Current Status (As of 3:15 PM)

### ✅ What's Complete

**Claude 2 (Web Frontend):**
- ✅ All 11 frontend tasks COMPLETE
- ✅ TypeScript build passing (0 errors)
- ✅ Production build ready: 231KB JS, 6KB CSS
- ✅ Components: Deck, JogWheel, Waveform, Crossfader, EQ, TrackSearch
- ✅ Redux store: decks, mixer, UI state
- ✅ API client ready: `src/services/api.ts` with JWT auth
- ⏸️ **HOLD** - waiting for your backend deployment

**Claude 1 (You - Backend):**
- ✅ Task 1: Backend project structure (`/Users/I870089/dropzone/backend/`)
- ✅ Task 2: Database models (SQLAlchemy models defined)
- 🚧 **Tasks 3-15:** IN PROGRESS (you're here now)

**Claude 3 (iOS App):**
- 🔄 Working in parallel - monitoring dashboard

---

## 📋 Your Next Steps (Tasks 3-15)

### Immediate: Create FastAPI App

**Plan location:** `/Users/I870089/docs/superpowers/plans/2026-03-15-dropzone-backend-api.md`

**Task Breakdown:**
- **Task 3:** FastAPI app initialization (`app/main.py`, CORS, middleware)
- **Task 4:** Spotify service (`app/services/spotify.py` - API client)
- **Task 5:** Tracks API (`GET /api/tracks/search`, `GET /api/tracks/{id}`)
- **Tasks 6-8:** Auth endpoints (`POST /api/auth/login`, JWT tokens)
- **Tasks 9-12:** Mixes, Presets, Autopilot APIs
- **Tasks 13-15:** Deploy to Render

---

## 🔌 API Endpoints You Need to Build

### Required by Frontend (Priority 1)

```python
# Health Check
GET /health → {"status": "healthy"}

# Track Search (Spotify)
GET /api/tracks/search?q={query}
Response: {
  "tracks": [
    {
      "id": "spotify:track:xyz",
      "name": "Around the World",
      "artist": "Daft Punk",
      "album": "Homework",
      "duration_ms": 429080,
      "preview_url": "https://...",
      "spotify_uri": "spotify:track:xyz",
      "bpm": 121,
      "key": "C# minor",
      "energy": 0.82,
      "danceability": 0.76
    }
  ]
}

# Track Details
GET /api/tracks/{track_id}
Response: Track (same schema as above)

# Authentication
POST /api/auth/login
Body: {"username": "user", "password": "pass"}
Response: {
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {"id": "123", "username": "user"}
}

POST /api/auth/logout
Response: {"success": true}

# Playlists
GET /api/playlists
Response: {
  "playlists": [
    {"id": "1", "name": "House Classics", "track_count": 42}
  ]
}

GET /api/playlists/{playlist_id}
Response: {
  "id": "1",
  "name": "House Classics",
  "tracks": [Track, Track, ...]
}
```

### Optional (Priority 2 - Future)

```python
# Mixes
POST /api/mixes
Body: {"name": "Friday Night Mix", "tracks": [...]}

GET /api/mixes
Response: {"mixes": [Mix, Mix, ...]}

# User Presets
GET /api/presets
POST /api/presets
PUT /api/presets/{id}

# Autopilot
GET /api/autopilot/suggestions?current_track_id={id}&energy={0.8}
Response: {"suggestions": [Track, Track, Track]}
```

---

## 🔐 Auth Flow (Required)

Frontend uses **JWT Bearer Tokens** in `Authorization` header:

```python
# app/auth/jwt.py
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

def create_access_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode = {"sub": user_id, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# app/auth/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        # Fetch user from database
        return user
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

Frontend flow:
1. User logs in → `POST /api/auth/login` → receives `access_token`
2. Store token: `localStorage.setItem('auth_token', token)`
3. All requests: `Authorization: Bearer {token}`
4. 401 error → clear token, redirect to login

---

## 🎵 Spotify Integration

You need to:
1. **Get Spotify credentials:**
   - Go to https://developer.spotify.com/dashboard
   - Create app: "DropZone DJ Platform"
   - Get `CLIENT_ID` and `CLIENT_SECRET`
   - Add to `.env`: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`

2. **Implement Spotify service:**
   ```python
   # app/services/spotify.py
   import spotipy
   from spotipy.oauth2 import SpotifyClientCredentials

   class SpotifyService:
       def __init__(self):
           self.sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials())

       def search_tracks(self, query: str, limit: int = 20):
           results = self.sp.search(q=query, type='track', limit=limit)
           return self._format_tracks(results['tracks']['items'])

       def get_track(self, track_id: str):
           track = self.sp.track(track_id)
           features = self.sp.audio_features(track_id)[0]
           return self._format_track(track, features)
   ```

3. **Spotify API returns:**
   - `sp.search()` - track metadata (name, artist, album, duration)
   - `sp.audio_features()` - BPM, key, energy, danceability

---

## 🗄️ Database Models (Already Created)

Location: `/Users/I870089/dropzone/backend/app/models/`

**Models:**
- `User` - id, username, email, hashed_password
- `Track` - id, spotify_id, name, artist, album, bpm, key, energy
- `Mix` - id, user_id, name, created_at, tracks (JSON)
- `Preset` - id, user_id, name, eq_settings (JSON), effects (JSON)

**Database:** PostgreSQL (use Neon for production, SQLite for local dev)

---

## 🚀 Deployment to Render

**When you finish Tasks 3-12:**

1. **Create `requirements.txt`:**
   ```
   fastapi==0.115.0
   uvicorn[standard]==0.32.0
   sqlalchemy==2.0.36
   psycopg2-binary==2.9.10
   python-jose[cryptography]==3.3.0
   passlib[bcrypt]==1.7.4
   spotipy==2.24.0
   python-dotenv==1.0.1
   ```

2. **Deploy to Render Web Service:**
   - Repository: `https://github.com/chadlmc1970/dropzone.git`
   - Branch: `main`
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000`
   - **Environment Variables:**
     - `DATABASE_URL` = Neon PostgreSQL connection string
     - `JWT_SECRET_KEY` = `openssl rand -hex 32`
     - `SPOTIFY_CLIENT_ID` = From Spotify Dashboard
     - `SPOTIFY_CLIENT_SECRET` = From Spotify Dashboard

3. **Expected URL:** `https://dropzone-api.onrender.com`

4. **Test Health Check:**
   ```bash
   curl https://dropzone-api.onrender.com/health
   # Expected: {"status": "healthy"}
   ```

---

## 🔗 Coordination with Other Agents

### After You Deploy Backend:

**Notify Claude 2 (Web):**
1. Backend live at `https://dropzone-api.onrender.com`
2. All endpoints tested and working
3. Green light to deploy frontend

**Claude 2 will then:**
1. Create GitHub repo: `https://github.com/chadlmc1970/dropzone.git`
2. Push code to GitHub
3. Deploy to Render Static Site: `https://dropzone.onrender.com`
4. Configure `VITE_API_URL=https://dropzone-api.onrender.com`

**Claude 3 (iOS):**
- Building monitoring dashboard
- Will test against live APIs once deployed

---

## 📁 File Locations

**Your workspace:** `/Users/I870089/dropzone/backend/`

**Plan to follow:** `/Users/I870089/docs/superpowers/plans/2026-03-15-dropzone-backend-api.md`

**Frontend (for reference):** `/Users/I870089/dropzone/web/`

**Frontend API client:** `/Users/I870089/dropzone/web/src/services/api.ts`

---

## ✅ Quick Start Commands

```bash
# Navigate to backend
cd /Users/I870089/dropzone/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env <<EOF
DATABASE_URL=sqlite:///./dropzone.db
JWT_SECRET_KEY=$(openssl rand -hex 32)
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
EOF

# Run migrations (if using Alembic)
alembic upgrade head

# Start dev server
uvicorn app.main:app --reload --port 8000

# Test
curl http://localhost:8000/health
```

---

## 🎯 Summary - What You Need to Do NOW

1. **Read the plan:** `/Users/I870089/docs/superpowers/plans/2026-03-15-dropzone-backend-api.md`
2. **Start Task 3:** Create FastAPI app (`app/main.py`)
3. **Implement Tasks 4-12:** Spotify service, endpoints, auth
4. **Test locally:** Verify all endpoints work
5. **Deploy to Render:** Get backend live at `https://dropzone-api.onrender.com`
6. **Notify Claude 2:** Give green light to deploy frontend

**ETA:** ~3 hours to complete Tasks 3-15

---

**Questions?** Check:
- Frontend API client: `/Users/I870089/dropzone/web/src/services/api.ts`
- Frontend types: `/Users/I870089/dropzone/web/src/types/index.ts`
- Your instructions: `/Users/I870089/dropzone/INSTRUCTIONS-CLAUDE-2-WEB.md`

**Good luck!** 🚀

— Claude 2 (Web Frontend - Standing By)
