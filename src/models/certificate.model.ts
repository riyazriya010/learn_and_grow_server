import { Schema, model, Document } from 'mongoose';

export interface ICertificate extends Document {
    userId: Schema.Types.ObjectId;
    courseId: Schema.Types.ObjectId;
    courseName: string;
    userName: string;
    issuedDate: Date;
}

const CertificateSchema = new Schema<ICertificate>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        courseName: { type: String, required: true },
        userName: { type: String, required: true },
        issuedDate: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const CertificateModel = model<ICertificate>('Certificate', CertificateSchema);
