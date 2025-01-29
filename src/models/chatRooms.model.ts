// models/Chat.ts
import { Schema, model, Document } from 'mongoose';

export interface IChatRooms extends Document {
    studentId: Schema.Types.ObjectId;
    mentorId: Schema.Types.ObjectId;
    lastMessage: string;
    userMsgCount: number;
    mentorMsgCount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const ChatRoomSchema: Schema = new Schema<IChatRooms>({
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true},
    mentorId: { type: Schema.Types.ObjectId, ref: "Mentors", required: true},
    lastMessage: { type: String, default: '' },
    userMsgCount: { type: Number, default: 0},
    mentorMsgCount: { type: Number, default: 0}
},
{ timestamps: true }
);

export const ChatRoomsModel = model<IChatRooms>('ChatRooms', ChatRoomSchema);
