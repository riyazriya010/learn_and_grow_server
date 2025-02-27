import mongoose, { Schema, Document, model, } from "mongoose";
import { ObjectId } from "mongodb";

export interface IUser extends Document {
  accessToken: String | undefined;
  _id: ObjectId,
  username: string,
  email: string,
  phone: string,
  password: string,
  role?: string,
  profilePicUrl?: string,
  studiedHours: number,
  isVerified: boolean,
  isBlocked: boolean,
  lastLogin?: Date;
  createdAt?: Date,
  updatedAt?: Date
}

const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: null },
  profilePicUrl: { type: String, required: true, default: 'img not having' },
  studiedHours: { type: Number, required: true, default: 0 },
  lastLogin: { type: Date, default: Date.now },
  isVerified: { type: Boolean, required: true, default: false },
  isBlocked: { type: Boolean, required: true, default: false }
},
{
  timestamps: true
}
)

const UserModel = mongoose.model<IUser>('User', UserSchema)

export default UserModel
