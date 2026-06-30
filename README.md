# Employee Management System

A full-stack employee management dashboard built with **Node.js / Express** (backend) and **React / Vite** (frontend).

---

## Features

- 🔐 JWT-based authentication (login / protected routes)
- 👥 Employee directory with search, department & status filters, and pagination
- 📊 Analytics dashboard — department breakdown, status distribution, monthly hires trend
- ✏️ Full CRUD — create, edit, and delete employee records
- 🌗 Light / dark theme toggle (persisted in localStorage)

---

## Project Structure

```
Employee Management System/
├── backend/          # Express API server
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed.js       # Seed script to populate sample data
│   ├── server.js
│   └── .env.example  # Copy to .env and fill in your values
└── frontend/         # React + Vite SPA
    └── src/
        ├── components/   # Sidebar, DashboardHeader, MetricCard, tab components, modals
        ├── context/      # AuthContext
        ├── pages/        # Login, Dashboard
        └── services/     # Axios API client
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1 · Backend Setup

```bash
cd backend
npm install

# Create your environment file
cp .env.example .env
# Edit .env and set MONGO_URI and JWT_SECRET

# Optional: seed the DB with sample employees
node seed.js

npm run dev
```

The API server starts at **http://localhost:5000**.

### 2 · Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The React app starts at **http://localhost:5173**.

---

## Environment Variables

See [`backend/.env.example`](./backend/.env.example) for all required variables.

| Variable    | Description                          |
|-------------|--------------------------------------|
| `PORT`      | Express server port (default `5000`) |
| `MONGO_URI` | MongoDB connection string            |
| `JWT_SECRET`| Secret key for signing JWT tokens    |

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | Node.js, Express, Mongoose, JWT     |
| Frontend | React 18, Vite, Recharts, Lucide    |
| Database | MongoDB                             |
