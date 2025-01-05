"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateModel = void 0;
const mongoose_1 = require("mongoose");
const CertificateSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
    courseName: { type: String, required: true },
    userName: { type: String, required: true },
    issuedDate: { type: Date, default: Date.now },
}, { timestamps: true });
exports.CertificateModel = (0, mongoose_1.model)('Certificate', CertificateSchema);
