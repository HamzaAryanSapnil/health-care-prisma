"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
// Configure Cloudinary once
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloud_name,
    api_key: config_1.default.cloudinary.api_key,
    api_secret: config_1.default.cloudinary.api_secret
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
const fileFilter = (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Invalid file type. Only image formats are allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`));
    }
};
// Use memory storage for buffer (works in deployment/serverless)
const storage = multer_1.default.memoryStorage();
// Configure multer with memory storage, file size limit, and file type validation
const upload = (0, multer_1.default)({
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
function uploadToCloudinary(file) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const uploadResult = yield cloudinary_1.v2.uploader.upload(dataUri, {
                public_id: `${file.originalname.replace(/\.[^/.]+$/, '')}-${Date.now()}`,
                resource_type: 'auto', // Auto-detect image/video
                folder: 'ph-health-care', // Organize files in folder
            });
            return uploadResult;
        }
        catch (error) {
            throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
        }
    });
}
;
exports.fileUploader = {
    upload,
    uploadToCloudinary
};
