"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeManagementModel = void 0;
const mongoose_1 = require("mongoose");
const BadgeManagementSchema = new mongoose_1.Schema({
    badgeName: { type: String, required: true },
    description: { type: String, required: true },
    value: { type: String, required: true },
    isListed: { type: Boolean, default: true }
}, {
    timestamps: true
});
exports.BadgeManagementModel = (0, mongoose_1.model)('BadgeManagement', BadgeManagementSchema);
