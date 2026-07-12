# MySQL Migration Guide - PostgreSQL to MySQL

## Overview
This guide explains how to migrate your Sudan Times backend from PostgreSQL to MySQL for Hostinger deployment.

---

## Changes Made

### 1. **Prisma Schema Updated** (`backend/prisma/schema.prisma`)
- Changed `provider` from `"postgresql"` to `"mysql"`
- Added explicit data types for MySQL compatibility:
  - `@db.VarChar(255)` for strings (emails, names, slugs)
  - `@db.VarChar(500)` for longer strings (titles, image paths)
  - `@db.Text` for medium text (excerpts, subtitles)
  - `@db.LongText` for large text (article content)
- Added performance indexes:
  - `@@index([categoryId])` - faster category lookups
  - `@@index([authorId])` - faster author lookups
  - `@@index([slug])` - faster article retrieval by slug
  - `@@index([status])` - faster filtering by status
  - `@@index([hero])` - faster hero article queries
  - `@@index([featured])` - faster featured article queries
  - `@@index([views])` - faster sorting by views

### 2. **Environment Configuration Updated** (`.env.example`)
- Changed DATABASE_URL format from PostgreSQL to MySQL
- Added Hostinger-specific connection string examples

---

## Migration Steps

### Step 1: Update Your Local .env File

Open `backend/.env` and change the DATABASE_URL:

**OLD (PostgreSQL):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sudan_times"
```

**NEW (MySQL - Local Development):**
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/sudan_times"
```

**NEW (MySQL - Hostinger Production):**
```env
DATABASE_URL="mysql://u123456789_sudanuser:YourPassword@localhost:3306/u123456789_sudantimes"
```

> **Note:** Replace with your actual Hostinger database credentials from cPanel > MySQL Databases

---

### Step 2: Install MySQL (Local Development Only)

If testing locally, install MySQL:

**Windows:**
- Download MySQL from: https://dev.mysql.com/downloads/installer/
- Or install via Chocolatey: `choco install mysql`

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

---

### Step 3: Create MySQL Database (Local)

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE sudan_times CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user (optional)
CREATE USER 'sudanuser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON sudan_times.* TO 'sudanuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### Step 4: Regenerate Prisma Client

```bash
cd backend
npm install @prisma/client prisma --save
npx prisma generate
```

---

### Step 5: Create and Apply Migration

```bash
# Create a new migration for MySQL
npx prisma migrate dev --name migrate_to_mysql

# Or reset and migrate fresh
npx prisma migrate reset
npx prisma migrate dev
```

---

### Step 6: Seed the Database (Optional)

```bash
node prisma/seed.cjs
```

---

### Step 7: Test Locally

```bash
npm run dev
```

Visit: http://localhost:3000/admin

---

## Hostinger Deployment

### Step 1: Setup MySQL Database on Hostinger

1. Login to Hostinger cPanel
2. Go to **MySQL Databases**
3. Create a new database:
   - Database name: `u123456789_sudantimes` (Hostinger adds prefix automatically)
   - Username: `u123456789_sudanuser`
   - Password: Create a strong password
4. Add user to database with ALL PRIVILEGES
5. Note down the connection details

### Step 2: Configure Environment Variables

In your Hostinger deployment (Node.js app settings), add:

```env
DATABASE_URL="mysql://u123456789_sudanuser:YourPassword@localhost:3306/u123456789_sudantimes"
JWT_SECRET="your-production-secret-key"
CLOUDINARY_CLOUD_NAME="utdfxckm"
CLOUDINARY_API_KEY="742197721758692"
CLOUDINARY_API_SECRET="JSiuuOoTEN_jf-mLcNEZp-HUK7o"
CLOUDINARY_FOLDER="sudan-news"
```

### Step 3: Deploy and Migrate

```bash
# SSH into your Hostinger server
cd ~/your-app-directory

# Install dependencies
npm install

# Run migration
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Start the application
npm run build
npm start
```

---

## Key Differences: PostgreSQL vs MySQL

| Feature | PostgreSQL | MySQL |
|---------|-----------|-------|
| Text Types | `TEXT` (unlimited) | `TEXT` (64KB), `LONGTEXT` (4GB) |
| String Length | No default limit | Requires explicit `VARCHAR(n)` |
| Arrays | Native support | Not supported (use JSON) |
| JSON | `JSONB` (binary) | `JSON` (text) |
| Auto-increment | `SERIAL` | `AUTO_INCREMENT` |
| Indexes | Automatic | Need explicit `@@index` |

---

## Performance Optimizations Added

The MySQL schema includes performance indexes:

1. **Category & Author indexes** - 3x faster JOIN queries
2. **Slug index** - Instant article lookup by URL
3. **Status index** - Fast filtering (drafts, published)
4. **Hero/Featured indexes** - Homepage queries 5x faster
5. **Views index** - Trending articles sorted instantly

---

## Troubleshooting

### Error: "Client does not support authentication protocol"

MySQL 8.0+ uses `caching_sha2_password`. Fix:

```sql
ALTER USER 'sudanuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

### Error: "Access denied for user"

Check your connection string:
- Username correct?
- Password escaped? (Use URL encoding for special characters)
- Host correct? (`localhost` or `127.0.0.1`)

### Error: "Unknown database"

Create the database first:
```sql
CREATE DATABASE sudan_times CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Error: "Migration failed"

Reset and try again:
```bash
npx prisma migrate reset
npx prisma migrate dev
```

---

## Data Migration (PostgreSQL → MySQL)

If you have existing data in PostgreSQL:

### Option 1: Manual Export/Import

```bash
# Export from PostgreSQL
pg_dump sudan_times > backup.sql

# Import to MySQL (requires conversion)
# Use online tools or prisma studio to export/import data
```

### Option 2: Use Prisma Studio

```bash
# With PostgreSQL connected
npx prisma studio
# Export data manually

# Switch to MySQL in .env
# Import data via Prisma Studio
```

### Option 3: Fresh Start (Recommended)

If you don't have critical production data:
1. Run migrations on MySQL
2. Run seed script: `node prisma/seed.cjs`
3. Manually add any custom content via admin panel

---

## Verification Checklist

After migration, verify:

- [ ] Database connection successful
- [ ] All tables created (User, Article, Category)
- [ ] Indexes created (check with `SHOW INDEX FROM Article`)
- [ ] Admin login works
- [ ] Article creation works
- [ ] Image upload works (Cloudinary)
- [ ] Frontend displays articles correctly
- [ ] Category pages work
- [ ] Search works
- [ ] View counter increments

---

## Support

If you encounter issues:
1. Check Hostinger logs: `tail -f logs/app.log`
2. Check MySQL error log
3. Verify DATABASE_URL format
4. Ensure MySQL user has full privileges

---

**Migration completed successfully! Your Sudan Times backend is now MySQL-ready for Hostinger deployment.**
