# SkillVerse Architecture

## Frontend

- `src/components/layout`: app shell, navbar, footer
- `src/components/ui`: reusable UI primitives
- `src/pages`: route-level pages
- `src/providers`: theme, language, and auth state
- `src/lib/api.js`: Axios client with JWT injection
- `src/data`: mock presentation data for landing and dashboard polish

## Backend

- `src/config`: database and Cloudinary setup
- `src/models`: MongoDB schemas for platform entities
- `src/controllers`: request handlers by domain
- `src/routes`: REST API surface
- `src/middleware`: auth, upload, and error handling
- `src/utils`: async wrapper, token generation, query helpers

## Core Data Flow

1. User signs up and receives JWT
2. Role-aware profile record is created for students or teachers
3. Frontend stores JWT and calls protected APIs through Axios
4. Students publish projects, talents, and posts
5. Teachers verify learners and review submissions
6. Admins moderate content, feature work, run competitions, and send announcements

## Suggested Next Production Enhancements

- Add refresh token rotation and email delivery service
- Replace placeholder certificate files with generated PDFs
- Add WebSocket or Pusher for real-time notifications and chat
- Integrate Cloudinary signed uploads from the frontend
- Add validation library such as Zod or Joi across request payloads
