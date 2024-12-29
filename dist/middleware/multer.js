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
const s3 = new client_s3_1.S3Client({
    region: 'us-east-1',
    credentials: {
        secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
        accessKeyId: process.env.ACCESS_KEY || ''
    }
});
console.log('s: ', process.env.SECRET_ACCESS_KEY);
console.log('a: ', process.env.ACCESS_KEY);
console.log('b: ', process.env.BUCKET_NAME);
// Configure multer-s3 storage
const storage = (0, multer_s3_1.default)({
    s3: s3,
    bucket: process.env.BUCKET_NAME || '',
    contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        cb(null, Date.now().toString());
    }
});
// Function to validate file types
function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png|gif|mp4|mov/;
    const extname = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    console.log('fileType: ', file);
    if (extname && mimeType) {
        cb(null, true);
    }
    else {
        cb(new Error('Error: Images and videos only (jpeg, jpg, png, gif, mp4, mov)!'));
    }
}
// Multer middleware configuration
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log('ogName file:', file.originalname);
        console.log('file:', file);
        checkFileType(file, cb);
    }
});
const uploadMiddleware = upload;
exports.default = uploadMiddleware;
