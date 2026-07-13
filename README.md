# Sudan News Today 📰

A modern news platform with integrated frontend and backend administration.

## 🚀 Quick Start

### Development Mode

```bash
# Terminal 1 - Frontend (React + Vite)
npm run dev

# Terminal 2 - Backend (Next.js Admin + API)
npm run dev:backend
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000/admin
- API: http://localhost:3000/api

### Production Mode

```bash
# Build everything
npm run build

# Start production server
npm start
```

All services run on http://localhost:3000

## 📁 Project Structure

```
.
├── src/                 # Frontend React app (Vite)
├── backend/             # Backend Next.js app (Admin + API)
│   ├── pages/
│   │   ├── admin/      # Admin panel pages
│   │   ├── api/        # API routes
│   │   └── [[...slug]].tsx  # Frontend SPA entry
│   ├── components/     # Backend components
│   └── prisma/         # Database schema
├── dist/               # Frontend build output
└── package.json        # Root package.json
```

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push to GitHub
2. Import project to Vercel
3. Set root directory to `backend`
4. Add environment variables
5. Deploy!

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server (Vite) |
| `npm run dev:backend` | Start backend dev server (Next.js) |
| `npm run build` | Build both frontend and backend |
| `npm run build:frontend` | Build only frontend |
| `npm run build:backend` | Build only backend |
| `npm start` | Start production server |
| `npm run prisma:seed` | Seed database with initial data |

## 🔧 Environment Variables

### Root `.env` (Frontend)
```env
VITE_API_URL=http://localhost:3000
```

### `backend/.env` (Backend)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
```

## 📚 Routes

After deployment, your site structure:

- `https://sudannewstoday.com/` - Frontend news site
- `https://sudannewstoday.com/admin` - Admin panel
- `https://sudannewstoday.com/api/*` - API endpoints

## 🛠️ Technology Stack

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- React Router
- Framer Motion

### Backend
- Next.js 14
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Editor.js
- AWS S3

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Full deployment instructions
- [API Documentation](./backend/API_DOCUMENTATION.md) - API reference
- [Video Features Guide](./backend/VIDEO_FEATURES_GUIDE.md) - Video upload & embed

## 🔒 Admin Access

Default admin credentials (change after first login):
- Email: admin@sudannews.com
- Password: admin123

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

All rights reserved © 2026 Sudan News Today

---

**Built with ❤️ for  in Sudan**
