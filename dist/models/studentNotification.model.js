"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentNotificationModel = void 0;
const mongoose_1 = require("mongoose");
const studentNotificationSchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Mentors',
        required: true
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderName: { type: String, required: true },
    seen: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
exports.StudentNotificationModel = (0, mongoose_1.model)('studentNotification', studentNotificationSchema);
