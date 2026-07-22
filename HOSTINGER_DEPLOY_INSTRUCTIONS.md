# 🚀 Hostinger Deployment Instructions

## Problem:
- Homepage shows NEW Header ✅
- Other pages show OLD Header ❌
- **Cause:** `.next` cache folder has old compiled pages

---

## ✅ Solution - Deploy to Hostinger:

### Option 1: Via Hostinger Control Panel

1. **Login to Hostinger Control Panel**
2. **Go to File Manager** or use FTP/SFTP
3. **Navigate to your project folder** (usually in `public_html` or `domains`)
4. **Delete the `.next` folder**
   - Find `.next` directory
   - Right-click → Delete
5. **Open Terminal/SSH** (Hostinger → Advanced → SSH Access)
6. **Run these commands:**

```bash
cd ~/public_html/your-project-name  # Update path to your project
git pull origin main                 # Pull latest code
npm install                          # Update dependencies
npm run build                        # Rebuild (creates new .next folder)
```

7. **Restart Node.js App**
   - Go to Hostinger Control Panel
   - Find "Node.js Applications" or "Application Manager"
   - Click "Restart" for your app

---

### Option 2: Via SSH (Recommended)

```bash
# 1. Connect via SSH
ssh your-username@your-server.hostinger.com

# 2. Navigate to project
cd ~/public_html/your-project-name

# 3. Pull latest code
git pull origin main

# 4. Delete old cache
rm -rf .next

# 5. Install dependencies
npm install

# 6. Rebuild
npm run build

# 7. Restart (if you have PM2 installed)
pm2 restart all
# OR restart via Hostinger control panel
```

---

### Option 3: Quick FTP Method

If you don't have SSH access:

1. **Connect via FTP** (FileZilla or Hostinger File Manager)
2. **Find and DELETE** the `.next` folder
3. **Go to Hostinger Control Panel**
4. **Node.js App Manager** → Click "Restart"
5. The app will rebuild automatically on restart

---

## ⚠️ Important Notes:

### About .next Cache:
- Next.js stores compiled pages in `.next/` folder
- When you update components, old pages stay cached
- **Always delete `.next` before rebuild** after making changes

### About Hostinger:
- Hostinger uses **shared hosting** - not auto-deploy like Railway
- You must **manually pull code and rebuild**
- Some Hostinger plans have **limited Node.js support**

---

## 🔄 After Deployment:

1. **Wait 2-3 minutes** for rebuild to complete
2. **Clear browser cache:**
   - Press `Ctrl + Shift + Delete`
   - Select "Cached images and files"
   - Click "Clear data"
3. **Hard refresh:** Press `Ctrl + F5`
4. **Test all pages:**
   - ✅ Homepage
   - ✅ Category pages (Economy, Politics, etc.)
   - ✅ Article pages
   - ✅ Breaking news ticker (should be slow - 180s)

---

## 🆘 If Still Not Working:

### Check Service Worker Cache:
Service worker might be caching old pages.

**Clear Service Worker:**
1. Open browser DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers**
4. Click **Unregister** for your site
5. Go to **Cache Storage**
6. Delete all caches
7. Hard refresh (Ctrl+F5)

---

## 📝 Deployment Checklist:

- [ ] SSH into Hostinger server
- [ ] Navigate to project directory
- [ ] Pull latest code (`git pull origin main`)
- [ ] Delete `.next` folder (`rm -rf .next`)
- [ ] Install dependencies (`npm install`)
- [ ] Rebuild project (`npm run build`)
- [ ] Restart Node.js app (via control panel or PM2)
- [ ] Clear browser cache
- [ ] Hard refresh and test all pages

---

## 🎯 Quick Command (Copy-Paste):

```bash
cd ~/public_html/your-project-name && \
git pull origin main && \
rm -rf .next && \
npm install && \
npm run build && \
echo "✅ Done! Now restart Node.js via Hostinger control panel"
```

Replace `your-project-name` with your actual folder name!

---

## 💡 Pro Tip:

Create a deploy script on your server:

```bash
# Save as deploy.sh in your project root
chmod +x deploy.sh
./deploy.sh
```

This way you only need to run `./deploy.sh` each time you deploy!
