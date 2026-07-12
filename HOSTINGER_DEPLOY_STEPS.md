# 🚀 Hostinger Deployment Steps

## ⚠️ IMPORTANT: Database Connection Note

**Hostinger MySQL databases only accept connections from `localhost`** (same server). You CANNOT connect from your local machine. You must deploy to Hostinger first, then run migrations there.

---

## Step 1: Upload Files to Hostinger

### Option A: Git Deployment (Recommended)

1. **SSH into your Hostinger server:**
   ```bash
   ssh u408915236@your-domain.com
   ```

2. **Clone your repository:**
   ```bash
   cd ~/public_html  # or your app directory
   git clone https://github.com/ok67sa-alt/news.git
   cd news
   ```

### Option B: FTP Upload

1. Use FileZilla or Hostinger File Manager
2. Upload all files EXCEPT:
   - `node_modules/`
   - `.env` (don't upload your local .env!)
   - `.git/` (optional)

---

## Step 2: Setup Environment on Hostinger Server

1. **SSH into Hostinger:**
   ```bash
   ssh u408915236@your-domain.com
   cd ~/public_html/news  # your app directory
   ```

2. **Copy production environment file:**
   ```bash
   cd backend
   cp .env.production .env
   ```

3. **Verify DATABASE_URL is correct:**
   ```bash
   cat .env | grep DATABASE_URL
   ```
   Should show:
   ```
   DATABASE_URL="mysql://u408915236_admin:Awab3100@localhost:3306/u408915236_sudannews"
   ```

---

## Step 3: Install Dependencies

```bash
# Still in backend directory
npm install

# Install Prisma CLI
npm install -D prisma
```

---

## Step 4: Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Deploy migrations (creates tables)
npx prisma migrate deploy

# Expected output:
# ✅ Applying migration `20260712163922_init_mysql`
# ✅ Migration applied successfully
```

---

## Step 5: Seed Database

```bash
# Create admin user and categories
node prisma/seed.cjs

# Expected output:
# 🌱 Starting production database seed...
# 📁 Creating categories...
#   ✓ Politics
#   ✓ Economy
#   ✓ Technology
#   ✓ Sports
#   ✓ Culture
#   ✓ Health
#   ✓ Education
# 👤 Creating admin user...
#   ✓ Admin user created
#   📧 Email: admin@sudantimes.com
#   🔑 Password: SudanTimes2024!
# ✅ Production seed completed successfully!
```

---

## Step 6: Build Application

```bash
# Build the Next.js app
npm run build

# Expected output:
# ✓ Creating an optimized production build
# ✓ Compiled successfully
```

---

## Step 7: Start Application

### Option A: Using PM2 (Recommended for production)

```bash
# Install PM2 globally
npm install -g pm2

# Start app with PM2
pm2 start npm --name "sudan-times" -- start

# Save PM2 process list
pm2 save

# Setup PM2 to start on server reboot
pm2 startup

# Check status
pm2 status
```

### Option B: Using npm start

```bash
npm start

# App will run on port 3000
# Keep terminal open or use screen/tmux
```

---

## Step 8: Configure Domain & Reverse Proxy

### Setup Nginx Reverse Proxy (if using Nginx)

1. Edit Nginx config:
   ```bash
   sudo nano /etc/nginx/sites-available/your-domain
   ```

2. Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. Enable site and reload Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/your-domain /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## Step 9: Enable SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Certbot will automatically configure HTTPS
```

---

## Step 10: Test Your Deployment

1. **Test Backend:**
   - Visit: `https://your-domain.com/api/articles`
   - Should return JSON array

2. **Test Admin Panel:**
   - Visit: `https://your-domain.com/admin/login`
   - Email: `admin@sudantimes.com`
   - Password: `SudanTimes2024!`
   - **CHANGE PASSWORD IMMEDIATELY!**

3. **Test Frontend:**
   - Visit: `https://your-domain.com`
   - Should see your homepage

4. **Test Image Upload:**
   - Create a new article in admin panel
   - Upload an image
   - Verify it displays on frontend

---

## 🔒 Security Checklist (IMPORTANT!)

After deployment:

- [ ] Change admin password immediately
- [ ] Update `JWT_SECRET` to a strong random string:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Enable firewall (UFW):
  ```bash
  sudo ufw allow 22    # SSH
  sudo ufw allow 80    # HTTP
  sudo ufw allow 443   # HTTPS
  sudo ufw enable
  ```
- [ ] Setup database backups
- [ ] Monitor logs: `pm2 logs sudan-times`

---

## 🆘 Troubleshooting

### Migration Fails

**Error:** `P1000: Authentication failed`

**Solution:**
1. Verify you're running commands ON the Hostinger server (via SSH)
2. Check DATABASE_URL in .env uses `localhost` not `mysql.hostinger`
3. Verify database credentials in Hostinger cPanel

### App Won't Start

**Solution:**
```bash
# Check logs
pm2 logs sudan-times

# Restart app
pm2 restart sudan-times

# Check if port 3000 is in use
sudo netstat -tulpn | grep 3000
```

### Database Connection Refused

**Solution:**
1. Check MySQL is running:
   ```bash
   sudo systemctl status mysql
   ```
2. Verify database exists:
   ```bash
   mysql -u u408915236_admin -p
   # Enter password: Awab3100
   SHOW DATABASES;
   ```

---

## 📋 Your Database Credentials

**Username:** `u408915236_admin`  
**Password:** `Awab3100`  
**Database:** `u408915236_sudannews`  
**Host:** `localhost` (when on Hostinger server)

---

## 🎉 Deployment Complete!

Once everything is running:
- Visit your website
- Login to admin panel and change password
- Start creating content!

**Admin Credentials (CHANGE AFTER LOGIN):**
- Email: `admin@sudantimes.com`
- Password: `SudanTimes2024!`
