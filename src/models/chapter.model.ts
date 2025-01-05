import { Schema, model, Document } from 'mongoose';

export interface IChapter extends Document {
    chapterTitle: string;
    courseId: Schema.Types.ObjectId; // Specify it as ObjectId
    chapterNumber: number;
    description: string;
    videoUrl: string;
    createdAt: Date;
    // quizId: string;
    // isCompleted: boolean;
}

const ChapterSchema = new Schema<IChapter>({
    chapterTitle: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true }, // Corrected to ObjectId
    chapterNumber: { type: Number },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    // quizId: { type: String },
    // isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

export const ChapterModel = model<IChapter>('Chapter', ChapterSchema);
