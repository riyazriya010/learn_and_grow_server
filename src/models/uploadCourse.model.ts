import { Schema, model, Document } from 'mongoose';

interface IDemoVideo {
  type: 'video';
  url: string;
}

interface IFullVideo {
  chapterId: string;
}

export interface ICourse extends Document {
  courseName: string;
  mentorId?: string;
  description: string;
  demoVideo: IDemoVideo[];
  fullVideo?: IFullVideo[];
  price: number;
  category: string;
  level: string;
  duration: string;
  thumbnailUrl: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const demoVideoSchema = new Schema<IDemoVideo>({
  type: { type: String, enum: ['video'], required: true },
  url: { type: String, required: true },
});

const CourseSchema = new Schema<ICourse>(
  {
    courseName: { type: String, required: true },
    mentorId: { type: String },
    description: { type: String, required: true },
    demoVideo: [demoVideoSchema],
    fullVideo: [
      {
        chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter' },
      },
    ],
    price: { type: Number, required: true },
    category: { type: String, required: true },
    level: { type: String, required: true },
    duration: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CourseModel = model<ICourse>('Course', CourseSchema);
