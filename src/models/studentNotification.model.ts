import { Schema, model, Document } from 'mongoose';

export interface IStudentNotification extends Document {
    senderId: Schema.Types.ObjectId;
    receiverId: Schema.Types.ObjectId;
    senderName: string;
    seen: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const studentNotificationSchema = new Schema<IStudentNotification>(
    {
        senderId: {
          type: Schema.Types.ObjectId,
          ref: 'Mentors',
          required: true
        },
        receiverId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        senderName: { type: String, required: true },
        seen: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
      },
      {
        timestamps: true
      }
)

export const StudentNotificationModel = model<IStudentNotification>('studentNotification', studentNotificationSchema)
