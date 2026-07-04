# Seedance AI - Production-Ready AI Video Generator SaaS

A premium, enterprise-grade AI Video Generation SaaS platform built with a modular provider architecture, multi-model support, background rendering queues, and integrated billing/payment systems.

---

## 🚀 Key Features

1. **AI Video Generation Grid**:
   - Advanced settings: prompt, negative prompt, aspect ratios (16:9, 9:16, 1:1, 2.35:1), resolutions (720p, 1080p, 4k), camera motions, style presets, seeds, and guidance scales.
   - Batch quantity dispatching (generate up to 4 scenes concurrently).
   
2. **Modular Provider Architecture**:
   - Out-of-the-box support for multiple video models: **Seedance v2 (Native)**, **Runway Gen-3**, **Kling 1.5 Pro**, **Google Veo**, and **Pika 2.0**.
   - Pluggable provider factories let you swap backend AI models with zero downtime and minimal code updates.
   
3. **Celery Worker queues & Redis Broker**:
   - Decoupled job scheduling handles high-latency video generation in the background.
   - Fault-tolerant retry mechanisms process network dropouts and rate limits.
   - Automatic user credit refunding for failed provider renders.
   
4. **JWT Authentication & Developer API Keys**:
   - Secure login, registration, email verification, and token rotation.
   - Developer keys encrypted with Fernet (AES-128 in CBC mode) for external script integrations.
   
5. **Integrated Payment systems**:
   - Dual-gateway setups supporting **Stripe** and **Razorpay** checkouts.
   - Secure webhook processing with signature validation to replenish credits in real-time.

---

## 📂 Project Architecture

```
seedance/
├── backend/                       # Django + DRF App Codebase
│   ├── core/                      # Global configurations (settings, celery, routing)
│   ├── users/                     # User Profile & JWT Authentication handlers
│   ├── video_gen/                 # Core Video Generation Logic & Tasks
│   │   ├── providers/             # Pluggable Provider Classes (Seedance, Runway, Kling, etc.)
│   │   │   ├── base.py
│   │   │   ├── factory.py
│   │   │   └── ...
│   │   ├── tasks.py               # Celery async pollers and cleaners
│   │   └── ...
│   ├── payments/                  # Stripe & Razorpay Webhook Fulfilment
│   ├── requirements.txt           # Python dependencies
│   └── Dockerfile                 # Backend container image build
│
├── src/                           # React 19 Frontend Codebase
│   ├── components/                # Reusable UI Blocks (GlassCard, VideoPlayer, Sidebar, Navbar)
│   ├── pages/                     # Main Views (LandingPage, Dashboard, Generator, Billing, Admin)
│   ├── store/                     # Zustand state machines (authStore, videoStore)
│   ├── index.css                  # Tailwind CSS v4 design tokens and coordinates
│   └── App.jsx                    # React Router 6 Protected Routes
│
├── public/                        # Builtin mockup asset visual resources
├── docker-compose.yml             # Local Multi-Container Stack orchestrator
├── nginx.conf                     # Reverse Proxy routing config
├── Dockerfile                     # Frontend container image build
└── README.md                      # Documentation
```

---

## 🛠️ Installation & Setup

### Option 1: Running via Docker Compose (Recommended)

1. Clone or copy the workspace directory to your machine.
2. Duplicate `.env.example` to `.env` and fill out your secrets and credentials:
   ```bash
   cp .env.example .env
   ```
3. Boot the complete containerized stack (PostgreSQL, Redis, Django API, Celery Workers, React Frontend, Nginx Proxy):
   ```bash
   docker-compose up --build
   ```
4. Access the application in your browser:
   - **Frontend App**: [http://localhost](http://localhost) (Routed by Nginx)
   - **Backend API Docs**: [http://localhost/api/](http://localhost/api/)

### Option 2: Running Locally for Development

#### 1. Frontend Setup
```bash
# Install NPM packages
npm install

# Start Vite hot-reload server
npm run dev
```

#### 2. Backend Setup
Make sure you have a Redis broker running locally (usually on port `6379`).
```bash
# Navigate to backend
cd backend

# Create Virtual Environment & Activate
python -m venv venv
venv\Scripts\activate # On Windows

# Install packages
pip install -r requirements.txt

# Run migrations and start Django
python manage.py migrate
python manage.py runserver
```

#### 3. Start Celery Workers
In a new terminal window:
```bash
cd backend
celery -A core worker --loglevel=info
```

---

## 🔌 API Endpoints Summary

### Authentication & Profiles
* `POST /api/auth/register/` - Create a new user account
* `POST /api/auth/login/` - Authenticate credentials and get JWT access + refresh tokens
* `POST /api/auth/token/refresh/` - Rotate expired access tokens
* `GET  /api/auth/profile/` - Fetch authenticated user settings
* `PUT  /api/auth/profile/` - Update profile settings

### Video Operations
* `POST /api/video/generate/` - Queue a new video job (Deducts credits, spawns Celery task)
* `GET  /api/video/status/<job_id>/` - Poll progress parameters (Queued -> Processing -> Completed)
* `GET  /api/video/history/` - List user history
* `DELETE /api/video/delete/<id>/` - Delete video item

### Payment Checkouts
* `POST /api/payment/create-order/` - Get Stripe Checkout URL or Razorpay ID
* `POST /api/payment/webhook/` - Process payment updates from Stripe or Razorpay signatures
