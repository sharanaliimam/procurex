# ProcureX – Mini Procurement Management System

A full MERN + Angular procurement management system: Tender Management, Vendor
Management, Bid Submission, Tender Evaluation, Document Management,
Notifications/Deadline Tracking, a Dashboard, and Reports & Search.

```
Angular (frontend, port 4200)  --REST-->  Node/Express (backend, port 5000)  --Mongoose-->  MongoDB
```

---

## 0. What you need installed first

You need **three** things on your computer before this project will run:

1. **Node.js** (v18 or v20 LTS recommended) — https://nodejs.org
   - Check with: `node -v` and `npm -v`
2. **MongoDB** — either:
   - **Local**: install MongoDB Community Server (https://www.mongodb.com/try/download/community) and make sure it's running, OR
   - **Cloud (easier, recommended for a demo)**: create a free cluster at https://www.mongodb.com/cloud/atlas and copy its connection string.
3. **Angular CLI** (optional but handy): `npm install -g @angular/cli`

> Tip: If you don't want to install MongoDB locally, MongoDB Atlas's free tier
> takes about 5 minutes to set up and gives you a connection string like
> `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/procurex`.

---

## 1. Project structure

```
procurex/
  backend/     ← Node.js + Express + Mongoose REST API
  frontend/    ← Angular 17 + Angular Material UI
```

---

## 2. Run the backend (API)

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set your MongoDB connection string, e.g.:

```
MONGO_URI=mongodb://127.0.0.1:27017/procurex
PORT=5000
```

(If using Atlas, paste your `mongodb+srv://...` URL instead.)

Load demo data (recommended — this gives you tenders, vendors, a bid, and an
evaluation to show immediately in your viva):

```bash
npm run seed
```

Start the API:

```bash
npm start
```

You should see:

```
MongoDB connected: ...
ProcureX API running on http://localhost:5000
```

Leave this terminal running. Test it works by opening
`http://localhost:5000/api/tenders` in your browser — you should see JSON.

---

## 3. Run the frontend (Angular)

Open a **second terminal**:

```bash
cd frontend
npm install
npm start
```

(`npm start` runs `ng serve`.) Then open **http://localhost:4200** in your
browser. The Angular app is already configured to talk to
`http://localhost:5000/api` (see `src/environments/environment.ts`).

---

## 4. What each feature does

| Page | What it demonstrates |
|---|---|
| **Dashboard** | Aggregation queries (MongoDB `$group`), summary cards, a simple bar chart, recent tenders, upcoming deadlines |
| **Tenders** | Full CRUD, Angular Reactive Forms, search + status filter |
| **Vendors** | Full CRUD, search |
| **Bids** | Relationship: Tender → Bid → Vendor (dropdowns reference other collections via `populate()`) |
| **Evaluation** | Business logic: `Overall Score = Technical×60% + Financial×40%` computed in the Mongoose model, ranked list, Approve/Reject actions |
| **Documents** | File upload via Multer, download, delete |
| **Notifications** | Computed on the fly from tender deadlines/status — no separate collection needed, but looks "smart" |
| **Reports** | Aggregation by status/category/month, search & filter |

---

## 5. REST API reference

```
GET    /api/tenders            POST  /api/tenders
GET    /api/tenders/:id        PUT   /api/tenders/:id       DELETE /api/tenders/:id

GET    /api/vendors             POST /api/vendors           PUT /api/vendors/:id     DELETE /api/vendors/:id

GET    /api/bids                POST /api/bids              PUT /api/bids/:id        DELETE /api/bids/:id

GET    /api/evaluations         POST /api/evaluations       PUT /api/evaluations/:id DELETE /api/evaluations/:id

GET    /api/documents           POST /api/documents (multipart file upload)
GET    /api/documents/:id/download                          DELETE /api/documents/:id

GET    /api/dashboard           -> aggregated stats for the dashboard
GET    /api/notifications       -> computed deadline/status notifications
GET    /api/reports/summary     -> status/category/month aggregation
```

---

## 6. Common problems

**"MongoDB connection error"** → MongoDB isn't running, or your `MONGO_URI` in
`.env` is wrong. If using Atlas, make sure your IP address is whitelisted
under Network Access in the Atlas dashboard.

**Frontend loads but Dashboard says "Could not load dashboard data"** → the
backend isn't running, or it's not on port 5000. Check the backend terminal
for errors.

**`npm install` fails on the frontend** → make sure you're using Node 18 or
20. Very new Node versions sometimes print warnings with Angular but still
work; actual failures usually mean a Node version mismatch — use `nvm` to
switch versions if you have it.

**Port already in use** → change `PORT` in `backend/.env`, and update
`apiUrl` in `frontend/src/environments/environment.ts` to match.

---

