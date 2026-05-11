# SkillVerse

SkillVerse is a full-stack platform for government school students to build a professional digital identity, showcase projects and talents, join competitions, connect with mentors, and gain recognition across India.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT, bcrypt, role-based access control
- Uploads: Cloudinary-ready upload pipeline
- Deployment: Vercel, Render/Railway, MongoDB Atlas

## Monorepo Structure

```text
skillverse/
  frontend/
  backend/
```

## Quick Start

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Setup

Copy:

- `backend/.env.example` to `backend/.env`
- `frontend/.env.example` to `frontend/.env`

## Core Modules

- Authentication with student, teacher, mentor, organizer, and admin roles
- Student and teacher profile system
- Project and talent showcase
- Social feed and comments
- Competitions and certificates
- Notifications, search, leaderboards, bookmarks, follows, and chat-ready messaging

## Deployment

Deployment steps are documented in:

- [backend/README.md](D:/dev/skillverse/backend/README.md)
- [frontend/README.md](D:/dev/skillverse/frontend/README.md)
