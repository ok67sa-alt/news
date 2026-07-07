import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

// Max file sizes (in bytes)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

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

function validateFile(file: formidable.File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.mimetype || !ALLOWED_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`
    };
  }

  // Check file size
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype);
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File too large. Maximum size for ${isImage ? 'images' : 'videos'} is ${maxSizeMB}MB`
    };
  }

  return { valid: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).json({ error: 'Method Not Allowed' });
  }

  // Check S3 configuration (optional - local storage is default)
  const hasS3Configured = !!(process.env.S3_BUCKET && process.env.S3_REGION);
  
  console.log('📤 Upload request received');
  console.log('🌍 Environment:', process.env.NODE_ENV);
  console.log('📦 Storage:', hasS3Configured ? 'S3/R2 (Persistent)' : 'Local Filesystem');
  
  // S3 is optional - if not configured, use local storage
  // Local storage is suitable for VPS deployments with persistent disks
  
  const form = formidable({ 
    multiples: false, 
    keepExtensions: true,
    maxFileSize: MAX_VIDEO_SIZE, // Set to max of all allowed types
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(400).json({ error: 'Failed to parse form data', details: err.message });
    }

    // Handle both 'file' and 'files' field names
    // In formidable v3, files are returned as arrays
    let file: formidable.File | undefined;
    
    if (files.file) {
      file = Array.isArray(files.file) ? files.file[0] : files.file;
    } else if (files.files) {
      file = Array.isArray(files.files) ? files.files[0] : files.files;
    }

    if (!file) {
      console.error('No file found in upload. Received files:', Object.keys(files));
      return res.status(400).json({ error: 'No file uploaded. Please include a file in the request.' });
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      // Clean up temp file
      try {
        await fs.promises.unlink(file.filepath);
      } catch (unlinkErr) {
        console.warn('Failed to delete invalid temp file:', unlinkErr);
      }
      return res.status(400).json({ error: validation.error });
    }

    try {
      let url: string;
      
      // Use S3 if configured, otherwise use local filesystem
      if (hasS3Configured) {
        console.log('☁️  Uploading to S3/R2...');
        url = await saveToS3(file);
        console.log('✅ S3 upload successful:', url);
      } else {
        console.log('💾 Uploading to local filesystem...');
        url = await saveToLocal(file);
        console.log('✅ Local upload successful:', url);
      }

      const fileType = ALLOWED_IMAGE_TYPES.includes(file.mimetype || '') ? 'image' : 'video';
      
      console.log('📋 Upload complete:', {
        type: fileType,
        url,
        size: `${(file.size / 1024).toFixed(2)}KB`,
        filename: file.originalFilename
      });
      
      return res.status(201).json({ 
        url,
        type: fileType,
        filename: file.originalFilename || 'unknown',
        size: file.size,
        mimetype: file.mimetype,
        storage: hasS3Configured ? 's3' : 'local'
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
