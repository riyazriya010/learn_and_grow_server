"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = require("mongoose");
const MessagesSchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'senderModel', // Dynamically reference the model based on senderModel field
        required: true
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'receiverModel', // Dynamically reference the model based on receiverModel field
        required: true
    },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: "ChatRooms" },
    message: { type: String, required: true },
    senderModel: { type: String, required: true, enum: ['User', 'Mentors'] },
    receiverModel: { type: String, required: true, enum: ['User', 'Mentors'] },
    deletedForSender: { type: Boolean, default: false },
    deletedForReceiver: { type: Boolean, default: false },
    readed: { type: Boolean, default: false },
}, {
    timestamps: true
});
exports.MessageModel = (0, mongoose_1.model)('Messages', MessagesSchema);
// sample saving data
// const newMessage = new MessageModel({
//     senderId: userId,        // or mentorId
//     receiverId: receiverId,  // userId or mentorId
//     roomId: roomId,
//     message: "Hello!",
//     senderModel: 'User',     // or 'Mentor' based on who is sending the message
//     receiverModel: 'Mentor'  // or 'User' based on who is receiving the message
//   });
//   await newMessage.save();
// import { Schema, Document, model } from "mongoose";
// export interface IMessages extends Document {
//     senderId: Schema.Types.ObjectId;
//     receiverId: Schema.Types.ObjectId;
//     roomId: Schema.Types.ObjectId;
//     message: string;
// }
// const MessagesSchema: Schema = new Schema<IMessages>({
//     senderId: { type: String, required: true },
//     receiverId: { type: String, required: true },
//     roomId: { type: Schema.Types.ObjectId, ref: "ChatRooms" },
//     message: { type: String, required: true },
// },
// {
//     timestamps: true
// }
// )
// export const MessageModel = model<IMessages>('Messages', MessagesSchema);
