# Quick Start: New Article Editor

## 🎯 In 30 Seconds

### What Changed?
✅ Replaced TinyMCE with Editor.js  
✅ Modern, compact layout  
✅ Sidebar design  
✅ No more slugs (auto-generated)  
✅ Better mobile support  

---

## 🚀 Start Using Now

### 1. Start Server
```bash
cd backend
npm run dev
```

### 2. Open Editor
```
http://localhost:3000/admin/articles/new
```

### 3. Create Article
1. Type title → slug auto-generated
2. Select category → from sidebar
3. Write content → use Editor.js
4. Upload image → optional
5. Click "نشر المقال" → done!

---

## ⌨️ Editor.js Quick Keys

| Action | Key |
|--------|-----|
| New block | `Enter` |
| Block menu | `Tab` or `/` |
| Bold | `Ctrl + B` |
| Italic | `Ctrl + I` |
| Link | `Ctrl + K` |
| Indent list | `Tab` |
| Outdent list | `Shift + Tab` |

---

## 🎨 Available Blocks

Click `+` button or press `Tab` to insert:

- **Text** - Paragraph (default)
- **Heading** - H1, H2, H3, H4
- **List** - Bullet or numbered
- **Quote** - Blockquote with author
- **Code** - Code snippet
- **Image** - Upload or drag & drop
- **Table** - Inline table
- **Link** - URL embed
- **Video** - YouTube, Twitter, etc.

---

## 📋 Sidebar Sections

### 1. النشر (Publish)
- Status: Draft/Review/Published
- Featured checkbox
- Breaking news checkbox
- **Publish button**

### 2. القسم (Category)
- Select from dropdown
- Required field

### 3. الصورة البارزة (Featured Image)
- Upload image
- Preview
- Remove option

### 4. الملخص (Excerpt)
- Short summary
- Optional

---

## ✅ Validation Rules

**Required:**
- ✓ Title
- ✓ Content (at least one block)
- ✓ Category

**Optional:**
- Excerpt
- Image
- Featured flag
- Breaking flag

---

## 📱 Mobile Ready

- ✅ Touch-optimized
- ✅ Responsive layout
- ✅ Works on tablets
- ✅ Easy to use on phones

---

## 🔥 Pro Tips

1. **Slug**: No need to enter, auto-generated from title
2. **Images**: Drag & drop directly into editor
3. **Draft**: Auto-saves as draft by default
4. **Quick Save**: Use sidebar "حفظ" button
5. **Preview**: See image preview before uploading

---

## 🐛 Troubleshooting

### Editor not loading?
```bash
# Reinstall dependencies
npm install
```

### Can't upload images?
- Check file size (<10MB)
- Check file type (jpg, png, gif, webp)
- Check `/api/admin/uploads` is working

### Content not saving?
- Check title is filled
- Check category is selected
- Check content has at least one block

---

## 📞 Need Help?

Check these files:
- `EDITOR_IMPROVEMENTS.md` - Full feature list
- `EDITOR_JS_MIGRATION.md` - Technical details
- `API_DOCUMENTATION.md` - API reference

---

**Last Updated**: June 16, 2026  
**Version**: 2.0  
**Status**: ✅ Production Ready
