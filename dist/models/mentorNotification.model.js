"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorNotificationModel = void 0;
const mongoose_1 = require("mongoose");
const mentorNotificationSchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Mentors',
        required: true
    },
    senderName: { type: String, required: true },
    seen: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
exports.MentorNotificationModel = (0, mongoose_1.model)('mentorNotification', mentorNotificationSchema);
