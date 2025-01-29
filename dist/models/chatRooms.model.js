"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoomsModel = void 0;
// models/Chat.ts
const mongoose_1 = require("mongoose");
const ChatRoomSchema = new mongoose_1.Schema({
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    mentorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Mentors", required: true },
    lastMessage: { type: String, default: '' },
    userMsgCount: { type: Number, default: 0 },
    mentorMsgCount: { type: Number, default: 0 }
}, { timestamps: true });
exports.ChatRoomsModel = (0, mongoose_1.model)('ChatRooms', ChatRoomSchema);
