import { Schema, model, Document } from 'mongoose';

export interface IOtp extends Document {
    email: string;
    otp: string;
    createdAt: Date;
    updatedAt: Date;
}

const OTPSchema = new Schema<IOtp>({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 }, // Auto-delete after 1 minute
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export const OTPModel = model<IOtp>('otp', OTPSchema);
