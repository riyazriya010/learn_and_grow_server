"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPModel = void 0;
const mongoose_1 = require("mongoose");
const OTPSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 }, // Auto-delete after 1 minute
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
exports.OTPModel = (0, mongoose_1.model)('otp', OTPSchema);
