"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasedCourseModel = void 0;
const mongoose_1 = require("mongoose");
const CompletedChapterSchema = new mongoose_1.Schema({
    chapterId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Chapter', required: true },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
});
const PurchasedCourseSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
    mentorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Mentors', required: true },
    completedChapters: [CompletedChapterSchema],
    isCourseCompleted: { type: Boolean, default: false },
    transactionId: { type: String },
    price: { type: String },
    purchasedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
}, { timestamps: true });
exports.PurchasedCourseModel = (0, mongoose_1.model)('PurchasedCourse', PurchasedCourseSchema);
