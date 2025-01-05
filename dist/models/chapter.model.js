"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterModel = void 0;
const mongoose_1 = require("mongoose");
const ChapterSchema = new mongoose_1.Schema({
    chapterTitle: { type: String, required: true },
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true }, // Corrected to ObjectId
    chapterNumber: { type: Number },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    // quizId: { type: String },
    // isCompleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.ChapterModel = (0, mongoose_1.model)('Chapter', ChapterSchema);
