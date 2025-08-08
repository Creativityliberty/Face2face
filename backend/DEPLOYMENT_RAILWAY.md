# Backend Deployment on Railway

This document explains how the backend is built and run on Railway using Docker.

## Overview
- Runtime: Node.js 20 (Alpine)
- Framework: Fastify 5
- ORM: Prisma 6
- Build: Multi-stage Docker build
- Serve uploads: `@fastify/static` on `/uploads/`

## Docker build stages
- deps: installs all dependencies (`npm ci`)
- builder:
  - copies source
  - runs `npx prisma generate`
  - runs `npm run build` (TypeScript → `dist/`)
  - prunes dev deps (`npm prune --omit=dev`)
- runner:
  - copies `dist/`, minimal `node_modules`, `package.json`, and `prisma/`
  - runs `npm start` → `node dist/index.js`

This ensures `tsc` exists during the build and production image is slim.

## Environment variables (Railway)
Set these in the Railway project:

- DATABASE_URL=postgresql://<user>:<pass>@<host>:<port>/<db>?schema=public
- JWT_SECRET=<random-32b>
- REFRESH_TOKEN_SECRET=<random-32b>
- NODE_ENV=production
- PORT=3001 (or leave empty, app listens on 0.0.0.0)
- CORS_ORIGINS=https://face2face-ufc9.vercel.app (add preview URLs if needed)
- MAX_FILE_SIZE=10485760 (optional, bytes)
- BASE_URL=https://<your-railway-domain> (optional; defaults to localhost)

## Health check
- GET `/health` should return `{ status: 'ok', timestamp: ... }`

## Uploads and storage
- Railway filesystem is ephemeral. Uploaded files in `/uploads` will not persist across restarts.
- Recommended: integrate Cloudinary/S3 for persistent storage. Until then, consider disabling uploads in production or making it clear in the UI.

## Local build & run
From `backend/`:

```bash
npm install
npm run db:generate
npm run build
npm start
```

## Notes
- TypeScript is configured for ES2022 modules.
- Removed top-level `await` and CommonJS `require` to satisfy TypeScript and bundler.
- Replaced `uuid` with `crypto.randomUUID()` to avoid extra typings.
- Removed the legacy `/api/media/recent` endpoint per product decision.
