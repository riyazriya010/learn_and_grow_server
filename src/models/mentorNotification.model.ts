import { Schema, model, Document } from 'mongoose';

export interface IMentorNotification extends Document {
    senderId: Schema.Types.ObjectId;
    receiverId: Schema.Types.ObjectId;
    senderName: string;
    seen: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const mentorNotificationSchema = new Schema<IMentorNotification>(
    {
        senderId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        receiverId: {
          type: Schema.Types.ObjectId,
          ref: 'Mentors',
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

export const MentorNotificationModel = model<IMentorNotification>('mentorNotification', mentorNotificationSchema)
