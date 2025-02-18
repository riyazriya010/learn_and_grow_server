"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
// Initialize S3 client with optimized settings
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY || '',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
    },
    requestHandler: {
        connectionTimeout: 60000, // Set connection timeout to 60 seconds
        socketTimeout: 60000, // Set socket timeout to 60 seconds
    },
});
// Function to validate file types
function checkFileType(file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov/;
    const isFileTypeValid = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const isMimeTypeValid = allowedTypes.test(file.mimetype);
    if (isFileTypeValid && isMimeTypeValid) {
        cb(null, true);
    }
    else {
        cb(new Error('Error: Only images (jpeg, jpg, png, gif) and videos (mp4, mov) are allowed!'));
    }
}
// Configure multer-s3 storage
const storage = (0, multer_s3_1.default)({
    s3,
    bucket: process.env.BUCKET_NAME || '',
    contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        const timestamp = Date.now().toString();
        const uniqueFileName = `${timestamp}-${file.originalname}`;
        cb(null, uniqueFileName);
    },
});
// Multer middleware configuration
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 100, // Set file size limit to 100 MB
    },
    fileFilter: (req, file, cb) => {
        console.log('Uploading file:', file.originalname);
        checkFileType(file, cb);
    },
});
// Export middleware for use in routes
const uploadMiddleware = upload;
exports.default = uploadMiddleware;
