import mongoose, { Schema, Document } from "mongoose";

export interface IBlacklistedToken extends Document {
  token: string;
  createdAt: Date;
}

const BlacklistedTokenSchema = new Schema<IBlacklistedToken>(
  {
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: "7d" },
  },
  { timestamps: true }
);

const BlacklistedTokenModel = mongoose.model<IBlacklistedToken>("BlacklistedToken", BlacklistedTokenSchema);
export default BlacklistedTokenModel;
