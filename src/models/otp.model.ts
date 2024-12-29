import mongoose, { Document, Schema } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IOtp extends Document {
  _id: ObjectId,
  email: string;
  otp: string;
  createdAt: Date;
}

const otpSchema: Schema<IOtp> = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const OtpModel = mongoose.model<IOtp>('otps', otpSchema);

export default OtpModel;
