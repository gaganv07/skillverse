# SkillVerse Backend

## Responsibilities

- Auth and RBAC
- Student, teacher, school, project, talent, and competition APIs
- Feed, comment, follow, bookmark, leaderboard, notification, and message APIs
- Upload validation and Cloudinary-ready media handling

## Commands

```bash
npm install
npm run dev
```

## Deployment

### Render or Railway

1. Create a new Node service from `backend/`
2. Set the start command to `npm start`
3. Add environment variables from `.env.example`
4. Point `MONGODB_URI` to MongoDB Atlas
5. Add Cloudinary credentials for production uploads

## API Base

`/api/v1`
