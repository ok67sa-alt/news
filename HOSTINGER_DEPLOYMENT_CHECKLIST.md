# Hostinger Deployment Checklist ✅

## ✅ Completed - Local Setup

- [x] Migrated from PostgreSQL to MySQL
- [x] Database created: `sudan_times`
- [x] Tables created (User, Category, Article)
- [x] Admin user created: `admin@sudantimes.com`
- [x] 7 categories seeded (Politics, Economy, Technology, Sports, Culture, Health, Education)
- [x] Local testing passed

---

## 🚀 Hostinger Deployment Steps

### Step 1: Setup MySQL Database on Hostinger

1. **Login to Hostinger cPanel**
   - Go to your Hostinger account
   - Click on "cPanel" or "hPanel"

2. **Create MySQL Database**
   - Navigate to **"MySQL Databases"**
   - Click **"Create New Database"**
   - Database name will be: `u123456789_sudantimes` (Hostinger adds your account prefix)
   - Note down the full database name

3. **Create MySQL User**
   - In the same MySQL Databases page
   - Create user: `u123456789_sudanuser` (or any name)
   - Set a **strong password** (mix of letters, numbers, symbols)
   - **IMPORTANT:** Save these credentials securely!

4. **Add User to Database**
   - In "Add User To Database" section
   - Select your user and database
   - Grant **ALL PRIVILEGES**
   - Click "Make Changes"

---

### Step 2: Upload Your Application

**Option A: Git Deployment (Recommended)**

```bash
# On your local machine
git remote add hostinger ssh://your-username@your-domain.com/path/to/repo
git push hostinger main
```

**Option B: FTP/SFTP Upload**

1. Use FileZilla or any FTP client
2. Connect using credentials from Hostinger
3. Upload all files EXCEPT:
   - `node_modules/` (will install on server)
   - `.env` (will create on server)
   - `.git/` (optional)

**Option C: Hostinger Git Integration**

1. In Hostinger panel, go to **"Git"**
2. Connect your GitHub repository
3. Select branch: `main`
4. Click "Deploy"

---

### Step 3: Configure Environment Variables on Hostinger

In your Hostinger Node.js application settings, add these environment variables:

```env
# Database (UPDATE WITH YOUR ACTUAL HOSTINGER CREDENTIALS)
DATABASE_URL="mysql://u123456789_sudanuser:YOUR_STRONG_PASSWORD@localhost:3306/u123456789_sudantimes"

# JWT Secret (generate a new one for production)
JWT_SECRET="your-production-secret-key-change-this"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="utdfxckm"
CLOUDINARY_API_KEY="742197721758692"
CLOUDINARY_API_SECRET="JSiuuOoTEN_jf-mLcNEZp-HUK7o"
CLOUDINARY_FOLDER="sudan-news"

# TinyMCE (optional - if you use it)
NEXT_PUBLIC_TINYMCE_API_KEY=""
```

**⚠️ CRITICAL:** Replace:
- `u123456789_sudanuser` with your actual MySQL username
- `YOUR_STRONG_PASSWORD` with your actual MySQL password
- `u123456789_sudantimes` with your actual database name
- `your-production-secret-key-change-this` with a random secure string

---

### Step 4: Install Dependencies on Server

SSH into your Hostinger server:

```bash
ssh your-username@your-domain.com
cd ~/your-app-directory

# Install dependencies
npm install

# Install Prisma CLI if needed
npm install -D prisma
```

---

### Step 5: Run Database Migration

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate deploy

# Seed the database (creates admin user & categories)
node prisma/seed.cjs
```

**Expected Output:**
```
🌱 Starting production database seed...
📁 Creating categories...
  ✓ Politics
  ✓ Economy
  ✓ Technology
  ✓ Sports
  ✓ Culture
  ✓ Health
  ✓ Education
👤 Creating admin user...
  ✓ Admin user created
  📧 Email: admin@sudantimes.com
  🔑 Password: SudanTimes2024!
  ⚠️  IMPORTANT: Change password immediately after first login!
✅ Production seed completed successfully!
```

---

### Step 6: Build and Start Application

```bash
# Build the application
npm run build

# Start the application
npm start

# Or use PM2 for process management (recommended)
npm install -g pm2
pm2 start npm --name "sudan-times" -- start
pm2 save
pm2 startup
```

---

### Step 7: Configure Domain & SSL

1. **Point Domain to Hostinger**
   - In your domain registrar, update nameservers to Hostinger's
   - Or add A record pointing to your Hostinger IP

2. **Enable SSL Certificate**
   - In Hostinger panel, go to **"SSL/TLS"**
   - Click **"Install SSL Certificate"**
   - Select **"Let's Encrypt"** (free)
   - Wait 5-15 minutes for activation

3. **Update API URL in Frontend**
   - Update your frontend `.env` or hardcoded API URLs
   - Change from `http://localhost:3000` to `https://yourdomain.com`

---

## 🔒 Security Checklist

After deployment:

- [ ] Change admin password immediately
  - Login: https://yourdomain.com/admin/login
  - Email: `admin@sudantimes.com`
  - Password: `SudanTimes2024!`
  - Go to admin panel and change password

- [ ] Update JWT_SECRET to a strong random string
  ```bash
  # Generate a secure secret:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- [ ] Set up database backups in Hostinger cPanel

- [ ] Enable HTTPS (force SSL redirect)

- [ ] Test all functionality:
  - [ ] Admin login works
  - [ ] Article creation works
  - [ ] Image upload works (Cloudinary)
  - [ ] Frontend displays articles
  - [ ] Categories work
  - [ ] Search works

---

## 🧪 Testing Your Deployment

1. **Test Admin Panel**
   - Visit: `https://yourdomain.com/admin/login`
   - Login with: `admin@sudantimes.com` / `SudanTimes2024!`
   - Change password immediately!

2. **Create Test Article**
   - Go to Articles → New Article
   - Fill in all fields
   - Upload an image (test Cloudinary)
   - Publish the article

3. **Test Frontend**
   - Visit: `https://yourdomain.com`
   - Check if article appears
   - Test category pages
   - Test article detail page
   - Test search (if enabled)

4. **Test Image Upload**
   - Create article with image
   - Check if image displays on frontend
   - Verify image is on Cloudinary dashboard

---

## 🆘 Troubleshooting

### Database Connection Fails

**Error:** `P1000: Authentication failed`

**Solution:**
1. Verify DATABASE_URL is correct
2. Check username matches (with Hostinger prefix)
3. Check password (no special characters like `@` or `#` in password without escaping)
4. Verify database exists: `SHOW DATABASES;`

### Migration Fails

**Error:** `Migration failed`

**Solution:**
```bash
# Check if tables exist
npx prisma db pull

# Reset and re-migrate (⚠️ deletes all data)
npx prisma migrate reset
npx prisma migrate deploy
```

### Admin Login Not Working

**Solution:**
1. Check if admin user exists:
   ```bash
   npx prisma studio
   # Open User table, look for admin@sudantimes.com
   ```
2. Re-run seed if needed:
   ```bash
   node prisma/seed.cjs
   ```

### Images Not Displaying

**Solution:**
1. Check Cloudinary credentials in environment variables
2. Check Cloudinary dashboard for uploaded images
3. Verify CLOUDINARY_FOLDER name matches

### "Cannot find module" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Performance Optimization (Optional)

After deployment, consider:

1. **Enable Caching**
   - Set up Redis for session storage
   - Cache frequently accessed articles

2. **CDN Setup**
   - Use Cloudflare (free) for static assets
   - Enable Cloudflare for entire site

3. **Database Optimization**
   - MySQL indexes already added ✅
   - Monitor slow queries

4. **Image Optimization**
   - Cloudinary auto-optimizes images ✅
   - Use WebP format when possible

---

## 📝 Admin Credentials

**⚠️ SAVE THESE SECURELY AND CHANGE IMMEDIATELY AFTER FIRST LOGIN!**

```
URL: https://yourdomain.com/admin/login
Email: admin@sudantimes.com
Password: SudanTimes2024!
```

**Categories Created:**
- Politics
- Economy
- Technology
- Sports
- Culture
- Health
- Education

---

## ✅ Post-Deployment Checklist

After successful deployment:

- [ ] Changed admin password
- [ ] Uploaded at least 5 articles
- [ ] Tested all categories
- [ ] Verified images load correctly
- [ ] Tested on mobile devices
- [ ] Set up Google Analytics (optional)
- [ ] Set up database backup schedule
- [ ] Documented custom domain setup
- [ ] Tested hero article feature
- [ ] Tested featured articles (Editor's Picks)
- [ ] Verified "What to Read Today" section works

---

## 🎉 You're Live!

Your Sudan Times news website is now live on Hostinger with MySQL!

**Next Steps:**
1. Start creating real news content
2. Invite other editors/writers (create more users in admin panel)
3. Share your website URL
4. Monitor traffic and performance

**Support:**
- Hostinger Support: https://www.hostinger.com/contact
- Prisma Docs: https://www.prisma.io/docs
- Cloudinary Docs: https://cloudinary.com/documentation

---

**Deployment Date:** _[Add date when completed]_  
**Deployed By:** _[Your name]_  
**Domain:** _[Your domain]_
