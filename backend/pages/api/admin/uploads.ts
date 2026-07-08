import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure Cloudinary
const cloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('☁️  Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME);
}

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

// Max file sizes (in bytes)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

async function saveToCloudinary(file: formidable.File): Promise<string> {
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype || '');
  const folder = process.env.CLOUDINARY_FOLDER || 'sudan-news';
  
  console.log('☁️  Uploading to Cloudinary:', file.originalFilename);
  
  try {
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: folder,
      resource_type: isVideo ? 'video' : 'image',
      public_id: `${path.basename(file.originalFilename || 'upload', path.extname(file.originalFilename || ''))}-${Date.now()}`,
      overwrite: false,
    });
    
    console.log('✅ Cloudinary upload successful:', result.secure_url);
    
    // Clean up temp file
    try {
      await fs.promises.unlink(file.filepath);
    } catch (err) {
      console.warn('Failed to delete temp file:', err);
    }
    
    return result.secure_url;
  } catch (error: any) {
    console.error('❌ Cloudinary upload failed:', error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
}

async function saveToLocal(file: formidable.File): Promise<string> {
  const cwd = process.cwd();
  const uploadsDir = path.resolve(cwd, 'public', 'uploads');
  
  console.log('📁 CWD:', cwd);
  console.log('📁 Uploads Directory:', uploadsDir);
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('📁 Creating uploads directory...');
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Generate unique filename with timestamp
  const ext = path.extname(file.originalFilename || '');
  const basename = path.basename(file.originalFilename || 'upload', ext);
  const safeName = basename.replace(/[^a-zA-Z0-9-_]/g, '-');
  const uniqueName = `${safeName}-${Date.now()}${ext}`;
  const destPath = path.join(uploadsDir, uniqueName);

  console.log('📁 Saving to:', destPath);
  await fs.promises.copyFile(file.filepath, destPath);
  
  // Verify file was saved
  const fileExists = fs.existsSync(destPath);
  const fileSize = fileExists ? fs.statSync(destPath).size : 0;
  console.log('✅ File saved:', fileExists, 'Size:', fileSize, 'bytes');
  
  // Clean up temp file
  try {
    await fs.promises.unlink(file.filepath);
  } catch (err) {
    console.warn('Failed to delete temp file:', err);
  }

  // Return path that will be served by /api/uploads/[...path].ts
  return `/uploads/${uniqueName}`;
}

async function saveToS3(file: formidable.File): Promise<string> {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION;
  const keyPrefix = process.env.S3_KEY_PREFIX || '';
  
  if (!bucket || !region) {
    throw new Error('S3 not configured properly. Set S3_BUCKET and S3_REGION environment variables.');
  }

  const client = new S3Client({ region });
  
  // Generate unique filename
  const ext = path.extname(file.originalFilename || '');
  const basename = path.basename(file.originalFilename || 'upload', ext);
  const safeName = basename.replace(/[^a-zA-Z0-9-_]/g, '-');
  const uniqueName = `${safeName}-${Date.now()}${ext}`;
  const key = `${keyPrefix}${uniqueName}`;

  const fileStream = fs.createReadStream(file.filepath);
  const uploadParams = {
    Bucket: bucket,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype || 'application/octet-stream',
    ACL: 'public-read' as const,
  };

  try {
    await client.send(new PutObjectCommand(uploadParams));
  } finally {
    fileStream.close();
    // Clean up temp file
    try {
      await fs.promises.unlink(file.filepath);
    } catch (err) {
      console.warn('Failed to delete temp file:', err);
    }
  }

  // Return public URL
  const publicUrl = process.env.S3_PUBLIC_URL || `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  return publicUrl;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check storage configuration
  const hasCloudinary = cloudinaryConfigured;
  const hasS3Configured = !!(process.env.S3_BUCKET && process.env.S3_REGION);
  
  console.log('📤 Upload request received');
  console.log('🌍 Environment:', process.env.NODE_ENV);
  console.log('📦 Storage:', hasCloudinary ? 'Cloudinary' : hasS3Configured ? 'S3/R2' : 'Local Filesystem');

  const form = formidable({
    maxFileSize: MAX_VIDEO_SIZE,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(400).json({ error: 'File upload failed', details: err.message });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.mimetype || '')) {
      return res.status(400).json({ 
        error: 'Invalid file type', 
        allowed: ALLOWED_TYPES,
        received: file.mimetype 
      });
    }

    // Validate file size
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype || '');
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      return res.status(400).json({ 
        error: 'File too large', 
        maxSize: `${maxSize / 1024 / 1024}MB`,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`
      });
    }

    try {
      let url: string;
      let storage: string;
      
      // Priority: Cloudinary > S3 > Local
      if (hasCloudinary) {
        console.log('☁️  Uploading to Cloudinary...');
        url = await saveToCloudinary(file);
        storage = 'cloudinary';
        console.log('✅ Cloudinary upload successful:', url);
      } else if (hasS3Configured) {
        console.log('☁️  Uploading to S3/R2...');
        url = await saveToS3(file);
        storage = 's3';
        console.log('✅ S3 upload successful:', url);
      } else {
        console.log('💾 Uploading to local filesystem...');
        url = await saveToLocal(file);
        storage = 'local';
        console.log('✅ Local upload successful:', url);
      }

      const fileType = ALLOWED_IMAGE_TYPES.includes(file.mimetype || '') ? 'image' : 'video';
      
      console.log('📋 Upload complete:', {
        type: fileType,
        url,
        size: `${(file.size / 1024).toFixed(2)}KB`,
        filename: file.originalFilename,
        storage
      });
      
      return res.status(201).json({ 
        url,
        type: fileType,
        filename: file.originalFilename || 'unknown',
        size: file.size,
        mimetype: file.mimetype,
        storage
      });
    } catch (uploadErr: any) {
      console.error('❌ Upload error:', uploadErr);
      return res.status(500).json({ 
        error: 'Upload failed', 
        details: uploadErr.message,
        stack: process.env.NODE_ENV === 'development' ? uploadErr.stack : undefined
      });
    }
  });
}
