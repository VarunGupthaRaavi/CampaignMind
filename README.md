# CampaignMind - AI Marketing Campaign Planner MVP

An enterprise-grade, production-ready AI Marketing Campaign Planner built with React 19, FastAPI, Supabase Auth, PostgreSQL, and Google Gemini 2.5 Flash API.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS v3 + shadcn/ui
- **Routing:** React Router v7
- **Data Fetching & State:** TanStack Query (React Query)
- **Auth Client:** Supabase JS Client
- **Deployment:** Vercel

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **ORM:** SQLAlchemy (Async)
- **Validation:** Pydantic v2 (Pydantic Settings)
- **Database:** Supabase PostgreSQL
- **Migrations:** Alembic
- **AI Integration:** Google GenAI SDK (Gemini 2.5 Flash API)
- **Deployment:** Render

---

## 📁 Repository Structure

```
CampaignMind/
├── frontend/                  # Vite + React 19 Frontend App
│   ├── public/                # Static public assets
│   ├── src/
│   │   ├── api/               # TanStack Query & API services
│   │   ├── components/        # UI & reusable domain components
│   │   │   ├── ui/            # shadcn/ui primitives (toast, skeleton, etc.)
│   │   │   └── common/        # Navbar, Sidebar, Header, AdminRoute, etc.
│   │   ├── context/           # React Context providers (Auth, Query, Toast)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Dashboard, Auth, and Root layouts
│   │   ├── pages/             # Page views mapped to routes
│   │   │   ├── admin/         # Admin Dashboard, Users, Campaigns, Analytics
│   │   │   ├── FeaturesPage.tsx
│   │   │   ├── PricingPage.tsx
│   │   │   ├── DocumentationPage.tsx
│   │   │   ├── ForbiddenPage.tsx (403)
│   │   │   └── NotFoundPage.tsx (404)
│   │   ├── routes/            # React Router configuration
│   │   └── types/             # TypeScript interfaces & API types
│   ├── Dockerfile             # Multi-stage production Nginx & Dev Dockerfile
│   ├── nginx.conf             # SPA routing & caching Nginx config
│   ├── .env.example
│   └── package.json
│
├── backend/                   # FastAPI Backend Service
│   ├── alembic/               # Database migration scripts
│   │   └── versions/
│   │       ├── 001_create_initial_schema.py
│   │       └── 002_add_user_role.py
│   ├── app/
│   │   ├── api/               # API routes (v1 endpoints: auth, campaigns, ai, admin)
│   │   ├── core/              # Config, Security (RBAC), DB initialization
│   │   ├── db/                # DB setup & seeders (seed_admin.py)
│   │   ├── models/            # SQLAlchemy ORM models (User, Campaign, CampaignOutput)
│   │   ├── schemas/           # Pydantic validation schemas
│   │   ├── services/          # Gemini 2.5 Flash AI integration service
│   │   └── main.py            # FastAPI entry point with admin seeder lifespan
│   ├── .env.example
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml         # Production Docker Compose manifest
├── docker-compose.dev.yml     # Hot-reload Development Docker Compose manifest
├── .env.example
└── README.md
```

---

## 🔑 Admin Account Seeding & Configuration

The application includes an automated administrator account seeder script (`backend/app/db/seed_admin.py`) that runs automatically when the FastAPI server starts.

### Admin Configuration
To set up an administrator account:
1. Open `backend/.env` (or set environment variables in your deployment dashboard):
   ```env
   ADMIN_EMAIL="admin@campaignmind.com"
   ADMIN_PASSWORD="YourSecureAdminPassword123"
   ADMIN_NAME="System Administrator"
   ```
2. Upon startup, if an account with `ADMIN_EMAIL` exists, its role will be set to `admin`. If it does not exist, an initial admin user is created with `role="admin"`.
3. Users with `role="admin"` gain access to the **Admin Suite** at `/admin`, allowing them to:
   - View top platform stats (Total Users, Total Campaigns, Today's Campaigns, AI Requests).
   - Manage registered users and promote/demote roles (`user` $\leftrightarrow$ `admin`).
   - View and delete any campaign across the platform.
   - Access global industry & goal analytics.

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js >= 18.x
- Python >= 3.11 (Python 3.13 supported)
- Supabase Project (PostgreSQL DB + Auth enabled)
- Gemini API Key (Google AI Studio)

---

### Backend Setup (`/backend`)

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Provide your Supabase DB URL, Supabase Auth keys, and Gemini API Key.

4. Run database migrations:
   ```bash
   python -m alembic upgrade head
   ```

5. Start FastAPI server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
   API Docs will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### Frontend Setup (`/frontend`)

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Set `VITE_API_BASE_URL=http://localhost:8000/api/v1`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY`.

4. Start Vite development server:
   ```bash
   npm run dev
   ```
   Application will be running at [http://localhost:5173](http://localhost:5173).

---

## 🐳 Docker Deployment

- **Development Mode with Hot-Reload**:
  ```bash
  docker compose -f docker-compose.dev.yml up --build
  ```

- **Production Mode (Nginx + FastAPI)**:
  ```bash
  docker compose up --build -d
  ```

---

## 🔒 Security & Environment Variables
Secrets and credentials MUST be placed in `.env` files. **Never commit `.env` files to git repositories.**
