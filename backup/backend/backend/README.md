# Sudan Times Backend

This Next.js backend exposes simple API endpoints for articles and categories.
It supports two modes:

- Development fallback: reads and (best-effort) writes to `src/data/news.json` from the front-end workspace for convenience.
- Production mode with PostgreSQL: set `DATABASE_URL` and Prisma will be used.

Quick setup:

1. Install dependencies (from `backend/`):

```bash
cd backend
npm install
```

2. If you want PostgreSQL + Prisma:

- Set `DATABASE_URL` environment variable to your Postgres connection string.
- Generate Prisma client and run migration:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

3. Start dev server:

```bash
npm run dev
```

Notes:
- Front-end expects the API base URL in `VITE_API_URL` (e.g. `http://localhost:3000`).
- The current API will function without a database but persistence is only to the JSON file for convenience.
