"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = void 0;
// models/Chat.ts
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    studentId: { type: String, required: true },
    mentorId: { type: String, required: true },
    courseId: { type: String, required: true },
    messages: [
        {
            senderId: { type: String, required: true },
            message: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            isDeleted: { type: Boolean, default: false },
        },
    ],
});
exports.ChatModel = (0, mongoose_1.model)('Chat', ChatSchema);
