import mongoose, { Schema, Document, model, mongo } from "mongoose";

export interface IUser extends Document {
  username: string,
  email: string,
  phone: string,
  password: string,
  role?: string,
  profilePicUrl?: string,
  studiedHours: number,
  isVerified: boolean,
  isBlocked: boolean,
  createdAt?: Date,
  updatedAt?: Date
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, require: true },
  role: { type: String, default: null },
  profilePicUrl: { type: String },
  studiedHours: { type: Number, require: true, default: 0 },
  isVerified: { type: Boolean, require: true, default: false },
  isBlocked: { type: Boolean, require: true, default: false }
},
{
  timestamps: true
}
)

const User = mongoose.model<IUser>('user', UserSchema)

export default User
