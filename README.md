# 🌊 NomadNest GoaAI
### *Discover. Work. Connect.*

> AI-powered hyper-local platform for digital nomads in Goa, India.
> Built for hackathons. Structured for startups.

---

## ✨ What It Does

NomadNest GoaAI solves two interconnected problems for digital nomads in Goa:

1. **Discovery** — AI-powered workspace matching based on work style, crowdsourced WiFi scores, live noise levels, and real-time occupancy data
2. **Community** — Live check-in system, skill visibility, collaboration matching, and AI-generated meetup suggestions

---

## 🗂 Project Structure

```
nomadnest-goa/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx       # Hero, features, testimonials
│   │   │   ├── Discover.jsx      # Browse + filter workspaces
│   │   │   ├── AIMatch.jsx       # Claude-powered matching form
│   │   │   ├── Community.jsx     # Live check-ins + collab
│   │   │   ├── Meetups.jsx       # Events + AI meetup generator
│   │   │   └── WorkspaceDetail.jsx # Full detail + check-in
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── WorkspaceCard.jsx
│   │   │   └── NomadCard.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios API layer
│   │   ├── App.jsx               # Router + auth context
│   │   ├── main.jsx
│   │   └── index.css             # Goa beach design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── server.js             # Main Express app
│   │   ├── routes/
│   │   │   ├── workspaces.js     # Workspace CRUD + reports
│   │   │   ├── ai.js             # Claude API endpoints
│   │   │   ├── checkins.js       # Live check-in system
│   │   │   ├── users.js          # Nomad profiles
│   │   │   └── meetups.js        # Events management
│   │   ├── services/
│   │   │   ├── aiService.js      # Claude prompt engineering
│   │   │   └── firebase.js       # Firestore connection
│   │   └── data/
│   │       └── mockData.js       # 6 verified Goa workspaces
│   └── package.json
│
├── render.yaml            # One-click Render deployment
├── package.json           # Root dev runner
└── README.md
```

---

## 🚀 Quick Start (Local Dev)

### Prerequisites
- Node.js 18+
- npm or yarn
- Anthropic API key (get one at console.anthropic.com)

### 1. Clone & install
```bash
git clone https://github.com/your-username/nomadnest-goa
cd nomadnest-goa
npm run install:all
```

### 2. Configure backend
```bash
cd backend
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 3. Configure frontend
```bash
cd frontend
cp .env.example .env
# For local dev, VITE_API_URL can stay empty (Vite proxy handles it)
```

### 4. Run both servers
```bash
# From project root:
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:3001
Health check: http://localhost:3001/health

---

## ☁️ Render.com Deployment Guide

> **Cost estimate: $0/month** on free tier. The $50 credit covers months of usage.

### Option A: One-click via render.yaml (recommended)

1. Push your repo to GitHub
2. Go to [render.com](https://render.com) → **New** → **Blueprint**
3. Connect your GitHub repo
4. Render reads `render.yaml` and creates both services automatically
5. In the Render dashboard, set these **secret environment variables** on the backend service:
   - `ANTHROPIC_API_KEY` → your key from console.anthropic.com
   - `FIREBASE_PROJECT_ID` → your project ID
   - `FIREBASE_SERVICE_ACCOUNT_KEY` → full JSON (paste as single line)
6. Trigger a deploy — both services will be live in ~3 minutes

### Option B: Manual setup

**Backend (Web Service)**
- Root directory: `backend`
- Build command: `npm install`
- Start command: `node src/server.js`
- Environment: Node
- Region: Singapore (closest to India)

**Frontend (Static Site)**
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Add redirect rule: `/* → /index.html` (for React Router)
- Set `VITE_API_URL` to your backend service URL

### Render Free Tier Notes
- Free web services **spin down after 15 min of inactivity** (cold start ~30s)
- For hackathon demos: keep a tab open or use a cron ping service
- Static sites (frontend) never spin down — always fast
- Upgrade to Starter ($7/mo) for always-on backend if needed

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | No | `development` or `production` |
| `ANTHROPIC_API_KEY` | **Yes** | Claude API key |
| `FIREBASE_PROJECT_ID` | No | Firebase project (for Firestore) |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | No | Firebase service account JSON |
| `FRONTEND_URL` | No | Frontend URL for CORS (production) |

### Frontend (`frontend/.env`)
| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Production only | Backend API base URL |
| `VITE_FIREBASE_API_KEY` | No | Firebase client auth |
| `VITE_FIREBASE_PROJECT_ID` | No | Firebase project ID |

---

## 🤖 AI Architecture

### Claude Integration (3 endpoints)

**1. Workspace Matching** (`POST /api/ai/match`)
- Takes user profile: work style, skills, must-haves, budget, mood
- Sends enriched workspace data to Claude claude-sonnet-4-20250514
- Returns: ranked recommendations with match scores, reasons, pro tips
- Fallback: returns top 3 by WiFi score if API fails

**2. Meetup Generation** (`GET /api/ai/meetup`)
- Reads active nomad community (skills, areas)
- Claude generates: meetup title, theme, venue, format, icebreaker
- New suggestion generated on each request

**3. Collaboration Matching** (`POST /api/ai/collab`)
- Takes seeker profile + available nomads
- Claude writes a personalized, warm connection message
- Suggests specific people to reach out to

### Prompt Engineering Patterns Used
- **Structured JSON output**: Claude asked to return only valid JSON, parsed safely
- **Graceful fallback**: Every AI call has a non-AI fallback
- **Context injection**: Full workspace/nomad data passed to Claude for accurate reasoning
- **Role framing**: Claude introduced as "NomadNest AI" for consistent persona

---

## 📊 API Reference

```
GET  /health                        → Health check
GET  /api/workspaces                → List workspaces (filterable)
GET  /api/workspaces/:id            → Single workspace + hourly data
POST /api/workspaces/:id/report     → Submit WiFi/noise report
POST /api/workspaces/:id/negotiate  → Request membership rate

POST /api/ai/match                  → AI workspace matching
GET  /api/ai/meetup                 → AI meetup suggestion
POST /api/ai/collab                 → Collaboration matching

GET  /api/checkins                  → All active check-ins
POST /api/checkins                  → Check in
DELETE /api/checkins/:userId        → Check out
PATCH /api/checkins/:userId         → Update status

GET  /api/meetups                   → List meetups
POST /api/meetups                   → Create meetup
POST /api/meetups/:id/rsvp          → RSVP

GET  /api/users                     → Active nomads
GET  /api/users/:id                 → User profile
```

---

## 🎨 Design System

**Theme**: Goa Beach Aesthetic — sunset gradients, ocean blues, glassmorphism

**Fonts**:
- Display: Fraunces (editorial serif — headlines and brand moments)
- Body: DM Sans (clean, readable — UI elements)

**Color Palette**:
- Sunset: `#ff6b6b` → `#ff8c42` → `#ffd166`
- Ocean: `#0a1628` → `#1e3a5f` → `#06b6d4`
- Glass: `rgba(255,255,255,0.08)` with `backdrop-filter: blur(20px)`

**Key Components**:
- `glass-card` — glassmorphism container with hover lift
- `btn-sunset` — gradient CTA button
- `btn-ghost` — frosted glass secondary button
- `wifi-dots` — 5-dot WiFi signal indicator
- `noise-bar` — horizontal noise level bar
- `skill-pill` — frosted tag chip

---

## 📈 Scaling to Production

### Phase 1 (Hackathon MVP)
- In-memory check-ins (current)
- Mock workspace data (6 spaces)
- Claude API on-demand

### Phase 2 (Post-hackathon)
- Replace mock data with Firestore CRUD
- Add Firebase Auth (email + Google)
- WebSocket for real-time check-ins (Socket.io)
- Actual GPS-based workspace discovery

### Phase 3 (Startup)
- Workspace owner dashboard + subscription management
- Mobile app (React Native)
- Payments: Razorpay for day passes
- Nomad reputation/review system
- Partner with Goa coworking spaces (affiliate model)

### Database Schema (Firestore)
```
workspaces/{id}        → workspace data
checkins/{userId}      → active check-in (TTL: 12h)
meetups/{id}           → meetup documents
users/{userId}         → nomad profiles
reports/{workspaceId}/{reportId}  → crowdsourced data
```

---

## 🛠 Tech Stack Summary

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + Vite | Fast, modern, great DX |
| Routing | React Router v6 | SPA navigation |
| Animations | CSS + Framer Motion | Smooth without overhead |
| Backend | Node.js + Express | Fast to build, easy deploy |
| AI | Claude claude-sonnet-4-20250514 | Best reasoning for recommendations |
| Database | Firebase Firestore | Real-time, no-ops, generous free tier |
| Auth | Firebase Auth | Ready-made, secure |
| Deployment | Render.com | Free tier, one-click from render.yaml |
| Icons | Lucide React | Clean, consistent |

---

## 📝 License

MIT — build something great with it.

---

*Built with 🌊 for the Goa Nomad Community*
*NomadNest GoaAI · Discover. Work. Connect.*
