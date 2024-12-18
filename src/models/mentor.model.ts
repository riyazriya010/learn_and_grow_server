import mongoose, { Schema, Document, model, } from "mongoose";
import { ObjectId } from "mongodb";

export interface IMentor extends Document {
    _id: ObjectId,
    username: string,
    email: string,
    password: string,
    phone: string,
    expertise: string,
    skills: string,
    profilePicUrl?: string,
    role: string,
    isVerified?: boolean,
    isBlocked?: boolean,
    createdAt?: Date,
    updatedAt?: Date
}

const MentorSchema: Schema<IMentor> = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  expertise: { type: String, required: true },
  skills: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: null },
  profilePicUrl: { type: String, required: true, default: 'img not provided' },
  isVerified: { type: Boolean, required: true, default: false },
  isBlocked: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
},
{
  timestamps: true
}
)

const MentorModel = mongoose.model<IMentor>('mentors', MentorSchema)

export default MentorModel
