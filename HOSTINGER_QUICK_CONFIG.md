# ⚡ Hostinger Quick Configuration Card

## 🎯 Hostinger Node.js App Settings

Copy these exact settings into Hostinger Node.js App configuration:

### Basic Settings
```
Application Name: Sudan Times
Node.js Version: 20.x
Application Root: public_html/sudan-times
Application URL: your-domain.com
```

### Build Configuration
```
Build Directory: ./
Build Command: npm install && npm run build
Start Command: npm start
Port: 3000
```

### Environment Variables
```env
DATABASE_URL=mysql://u408915236_admin:Awab3100@localhost:3306/u408915236_sudannews
JWT_SECRET=change-this-to-random-secret-in-production
CLOUDINARY_CLOUD_NAME=utdfxckm
CLOUDINARY_API_KEY=742197721758692
CLOUDINARY_API_SECRET=JSiuuOoTEN_jf-mLcNEZp-HUK7o
CLOUDINARY_FOLDER=sudan-news
```

---

## 📋 Deployment Checklist

- [ ] Node.js app created in Hostinger
- [ ] GitHub repository connected
- [ ] Environment variables configured
- [ ] Build command set to `npm install && npm run build`
- [ ] Start command set to `npm start`
- [ ] Deploy triggered
- [ ] Build completed successfully
- [ ] SSH into server
- [ ] Run `cd ~/public_html/sudan-times/backend`
- [ ] Run `npx prisma migrate deploy`
- [ ] Run `node prisma/seed.cjs`
- [ ] Visit your domain
- [ ] Test admin login
- [ ] Change admin password

---

## 🚨 Important Notes

✅ **Build directory `./` is CORRECT** - Don't try to change it  
✅ **Builds BOTH frontend and backend** automatically  
✅ **Frontend copied to `backend/public/`** automatically  
✅ **Database migrations** must be run manually via SSH  

---

## 🔗 After Deployment

### Test URLs:
- Homepage: `https://your-domain.com`
- API: `https://your-domain.com/api/articles`
- Admin: `https://your-domain.com/admin/login`

### Default Credentials:
```
Email: admin@sudantimes.com
Password: SudanTimes2024!
⚠️ CHANGE IMMEDIATELY!
```

---

## 🆘 If Build Fails

### Option 1: Check Hostinger Build Log
Look for errors like:
- `MODULE_NOT_FOUND` → Missing dependencies
- `ENOENT` → Missing files
- `Prisma` errors → Database connection

### Option 2: Manual Deployment
```bash
ssh u408915236@your-domain.com
cd ~/public_html
git clone https://github.com/ok67sa-alt/news.git sudan-times
cd sudan-times
npm install && npm run build
cd backend
cp ../.env.production .env
npx prisma migrate deploy
node prisma/seed.cjs
pm2 start npm --name sudan-times -- start
```

---

## 📚 Full Documentation

- `HOSTINGER_BUILD_GUIDE.md` - Complete build explanation
- `HOSTINGER_DEPLOY_STEPS.md` - Step-by-step deployment
- `ARCHITECTURE.md` - How the project is structured

---

**Copy this to your Hostinger dashboard and you're ready to deploy! 🚀**
