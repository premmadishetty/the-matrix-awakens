# The Matrix Awakens — Private Repository

> Full source code for production deployment.
> **Keep this repository private.**

[![Worker](https://img.shields.io/badge/BACKEND-Cloudflare_Workers-F48120?style=flat-square&logo=cloudflare)](https://the-matrix-awakens.premmadishetty.workers.dev/api/health)
[![Frontend](https://img.shields.io/badge/FRONTEND-Vercel-black?style=flat-square&logo=vercel)](https://the-matrix-awakens.vercel.app)
[![Status](https://img.shields.io/badge/STATUS-LIVE-00ff41?style=flat-square)](#)

---

## Repository Structure

```
the-matrix-awakens/
│
├── 📄 README.md                    ← You are here
│
├── 🔵 backend/
│   ├── src/
│   │   └── worker.js               ← Cloudflare Worker (all API logic)
│   ├── schema.sql                  ← D1 database table definitions
│   ├── wrangler.toml               ← Cloudflare deployment config
│   ├── package.json                ← hono + wrangler deps
│   └── .env.example                ← Secret keys reference
│
└── 🟢 frontend/
    ├── src/
    │   ├── components/             ← All React components
    │   │   ├── landing/            ← Page sections
    │   │   └── ui/                 ← shadcn/ui base components
    │   ├── contexts/
    │   │   └── ThemeContext.tsx    ← Tri-mode theme engine
    │   ├── hooks/
    │   │   └── useTracker.ts      ← Visitor analytics tracker
    │   └── pages/
    │       └── Index.tsx           ← Stage machine entry point
    ├── public/
    │   └── resume.pdf              ← Your resume (replace to update)
    ├── .env.example                ← Frontend env vars reference
    └── vite.config.ts
```

---

## Quick Start — Local Development

### Backend

```bash
cd backend
npm install
npx wrangler login        # first time only
npm run dev               # runs on http://localhost:8787
```

Test:
```
http://localhost:8787/api/health
→ { "status": "[MATRIX_ONLINE]" }
```

### Frontend

```bash
cd frontend
npm install
# Create .env.local:
echo "VITE_API_URL=http://localhost:8787" > .env.local
npm run dev               # runs on http://localhost:5173
```

---

## Production Deployment

### Step 1 — Deploy Backend

```bash
cd backend

# One-time: create D1 database (skip if already done)
npx wrangler d1 create matrix-karma-db
# Paste the database_id into wrangler.toml

# One-time: initialize database tables (skip if already done)
npm run db:init:remote

# Set secrets (run each, paste value when prompted)
npx wrangler secret put GROQ_API_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_SECRET

# Deploy
npm run deploy
# → Live at: https://the-matrix-awakens.premmadishetty.workers.dev
```

### Step 2 — Deploy Frontend

1. Push to GitHub (see **GitHub Push Guide** below)
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Set **Root Directory** = `frontend`, **Framework** = Vite
4. Add environment variable:
   ```
   VITE_API_URL = https://the-matrix-awakens.premmadishetty.workers.dev
   ```
5. Deploy

---

## GitHub Push Guide

### First time — New repository

```bash
# From your project root folder:

# Initialize git (if not already done)
git init
git branch -M main

# Add remote (create the repo on github.com first, then:)
git remote add origin https://github.com/premmadishetty/the-matrix-awakens-private.git

# Stage and push everything
git add .
git commit -m "initial commit — full source"
git push -u origin main
```

### Every day — Making changes

```bash
git add .
git commit -m "describe what you changed"
git push
```

Vercel auto-deploys frontend on every push to `main`. Backend requires `npm run deploy` separately.

### Common change scenarios

| What changed | Commands |
|---|---|
| Frontend code or resume | `git add . && git commit -m "msg" && git push` |
| `backend/src/worker.js` | `cd backend && npm run deploy`, then `git push` |
| Adding a new secret | `npx wrangler secret put SECRET_NAME` |
| Update D1 schema | `npm run db:init:remote` (uses `IF NOT EXISTS` — safe to re-run) |

---

## Environment Variables

### Backend secrets (set via Wrangler CLI — never committed to git)

| Secret | Value | Where to get |
|--------|-------|-------------|
| `GROQ_API_KEY` | `gsk_...` | [console.groq.com](https://console.groq.com) |
| `RESEND_API_KEY` | `re_...` | [resend.com](https://resend.com) |
| `ADMIN_EMAIL` | `your@email.com` | Your email address |
| `ADMIN_SECRET` | `your_password` | Choose a strong one |

To view or rotate a secret:
```bash
npx wrangler secret put ADMIN_SECRET    # update value
npx wrangler secret list                # see what's set (values hidden)
npx wrangler secret delete SECRET_NAME  # remove a secret
```

### Frontend env vars (set in Vercel dashboard)

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://the-matrix-awakens.premmadishetty.workers.dev` |

For local dev, create `frontend/.env.local` (gitignored):
```
VITE_API_URL=http://localhost:8787
```

---

## Admin Dashboard

Access at:
```
https://the-matrix-awakens.premmadishetty.workers.dev/admin?key=YOUR_ADMIN_SECRET
```

Or navigate to `/admin` and type the secret into the password gate.

**Tabs:**
- **Dashboard** — KPI cards, visits/day chart, country breakdown, hourly heatmap
- **Visits** — Every page load with geo, browser, session time, clicks
- **Chat Logs** — Full Sentinel conversation audit trail, searchable
- **Leads** — Contact form submissions with full messages
- **Errors** — API failures, DB errors, rate limit hits

---

## Updating Your Resume

1. Replace `frontend/public/resume.pdf` with your new PDF (keep the same filename)
2. Push:
```bash
git add frontend/public/resume.pdf
git commit -m "update resume"
git push
```
Vercel redeploys in ~30 seconds.

---

## Troubleshooting

### `ENOENT: no such file or directory, open package.json`
You're in the wrong folder. Make sure you're inside `backend/` or `frontend/` before running `npm` commands.
```bash
cd backend    # for backend commands
cd frontend   # for frontend commands
```

### `binding DB of type d1 must have a valid id`
You haven't replaced `PASTE_YOUR_D1_ID_HERE` in `wrangler.toml`. Run:
```bash
npx wrangler d1 create matrix-karma-db
```
Copy the `database_id` from the output and paste it into `wrangler.toml`.

### `Authentication error [code: 10000]` when running D1 commands
Your Wrangler session expired. Re-authenticate:
```bash
npx wrangler login
```

### `no such column: is_high_intent` or similar DB errors
Your D1 schema is outdated. Run the ALTER TABLE migrations:
```bash
npx wrangler d1 execute matrix-karma-db --remote --command "ALTER TABLE karma_logs ADD COLUMN is_high_intent INTEGER DEFAULT 0"
```
Or drop and recreate the table if it's a fresh install:
```bash
npm run db:init:remote
```

### Chat gives 500 error / AI not responding
1. Check your Groq API key is set: `npx wrangler secret list`
2. Verify the key works at [console.groq.com](https://console.groq.com)
3. Check Worker logs: `npx wrangler tail` (shows live requests)
4. Check the Errors tab in your admin dashboard

### Emails not sending (contact form 500)
1. Verify Resend key: `npx wrangler secret list`
2. Check Resend dashboard at [resend.com](https://resend.com) for delivery logs
3. The `from` address must be `onboarding@resend.dev` unless you've verified a custom domain

### CORS errors in browser console
Your Vercel URL isn't in the CORS allowlist in `worker.js`. Find this section:
```js
const allowed = [
  'https://the-matrix-awakens.vercel.app',
  'http://localhost:5173',
];
```
Add your exact Vercel URL. Then `npm run deploy`.

### Visits page empty / Total Visits = 0
`useTracker()` isn't firing. Verify:
1. `frontend/src/hooks/useTracker.ts` exists
2. `Portfolio.tsx` imports and calls `useTracker()`
3. `VITE_API_URL` is set correctly in Vercel env vars (no trailing slash)
4. Open browser DevTools → Network tab → look for a POST to `/api/track` on page load

### Admin dashboard tabs not working
The JavaScript is being blocked by the Content Security Policy. Verify `worker.js` has this at the top:
```js
matrixProxy.use('*', (c, next) => {
  if (c.req.path.startsWith('/admin')) return next();
  return secureHeaders()(c, next);
});
```

### Wrangler update warning
```
▲ [WARNING] The version of Wrangler you are using is now out-of-date.
```
Safe to ignore, or update with:
```bash
npm install --save-dev wrangler@4
```

### `npm run deploy` succeeds but changes don't appear on live site
Cloudflare propagates instantly but your browser may be caching. Hard refresh:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Cloudflare Workers, Hono framework |
| Database | Cloudflare D1 (SQLite at edge) |
| AI | Groq API — Llama 3.1 8B Instant |
| Email | Resend |
| Frontend hosting | Vercel |
| Backend hosting | Cloudflare Workers (free tier) |

---

## Live URLs

| Resource | URL |
|----------|-----|
| Portfolio | https://the-matrix-awakens.vercel.app |
| Worker health | https://the-matrix-awakens.premmadishetty.workers.dev/api/health |
| Admin dashboard | https://the-matrix-awakens.premmadishetty.workers.dev/admin |
| Public blueprint repo | https://github.com/premmadishetty/the-matrix-awakens |

> **Custom domain:** `premmadishetty.com` should be configured in the Vercel dashboard
> (Project → Settings → Domains) — it is not a code change.
