import multer from "multer"
import { v2 as cloudinary } from 'cloudinary';
import config from "../config";

// Configure Cloudinary once
cloudinary.config({ 
    cloud_name: config.cloudinary.cloud_name, 
    api_key: config.cloudinary.api_key, 
    api_secret: config.cloudinary.api_secret 
});

// File size limit: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

// Supported image formats
const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/x-icon',
    'image/vnd.microsoft.icon',
    'image/ico'
];

// File filter to validate image types
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Only image formats are allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`));
    }
};

// Use memory storage for buffer (works in deployment/serverless)
const storage = multer.memoryStorage();

// Configure multer with memory storage, file size limit, and file type validation
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: fileFilter
});

/**
 * Upload file buffer to Cloudinary
 * @param file - Multer file object with buffer
 * @returns Cloudinary upload result
 */
async function uploadToCloudinary(file: Express.Multer.File) {
    if (!file.buffer) {
        throw new Error('File buffer is required for upload');
    }

    // Validate file size (additional check)
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds the maximum limit of 2MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // Validate file type (additional check)
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        throw new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
    }

    try {
        // Convert buffer to data URI format for Cloudinary
        // Format: data:[<mediatype>][;base64],<data>
        const base64Data = file.buffer.toString('base64');
        const dataUri = `data:${file.mimetype};base64,${base64Data}`;

        // Upload to Cloudinary using buffer (data URI)
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
            public_id: `${file.originalname.replace(/\.[^/.]+$/, '')}-${Date.now()}`,
            resource_type: 'auto', // Auto-detect image/video
            folder: 'ph-health-care', // Organize files in folder
        });

        return uploadResult;
    } catch (error: any) {
        throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
    }
};

export const fileUploader = {
  upload,
  uploadToCloudinary
}