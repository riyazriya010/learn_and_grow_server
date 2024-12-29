import dotenv from 'dotenv';
dotenv.config();

import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';

const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
        accessKeyId: process.env.ACCESS_KEY || ''
    }
});
console.log('s: ', process.env.SECRET_ACCESS_KEY)
console.log('a: ', process.env.ACCESS_KEY)
console.log('b: ', process.env.BUCKET_NAME)

// Configure multer-s3 storage
const storage = multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME || '',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req: Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
        cb(null, Date.now().toString());
    }
});

// Function to validate file types
function checkFileType(file: Express.Multer.File, cb: FileFilterCallback): void {
    const fileTypes = /jpeg|jpg|png|gif|mp4|mov/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    console.log('fileType: ', file)
    if (extname && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Error: Images and videos only (jpeg, jpg, png, gif, mp4, mov)!'));
    }
}

// Multer middleware configuration
const upload = multer({
    storage: storage,
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
      console.log('ogName file:', file.originalname); 
      console.log('file:', file); 
        checkFileType(file, cb);
    }
});

const uploadMiddleware = upload;

export default uploadMiddleware;



