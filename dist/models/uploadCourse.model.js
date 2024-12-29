"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModel = void 0;
const mongoose_1 = require("mongoose");
const demoVideoSchema = new mongoose_1.Schema({
    type: { type: String, enum: ['video'], required: true },
    url: { type: String, required: true },
});
const CourseSchema = new mongoose_1.Schema({
    courseName: { type: String, required: true },
    mentorId: { type: String },
    description: { type: String, required: true },
    demoVideo: [demoVideoSchema],
    fullVideo: [
        {
            chapterId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Chapter' },
        },
    ],
    price: { type: Number, required: true },
    category: { type: String, required: true },
    level: { type: String, required: true },
    duration: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    isPublished: { type: Boolean, default: true },
}, { timestamps: true });
exports.CourseModel = (0, mongoose_1.model)('Course', CourseSchema);