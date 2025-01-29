"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BagdetModel = void 0;
const mongoose_1 = require("mongoose");
const BadgeSchema = new mongoose_1.Schema({
    badgeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BadgeManagement', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
exports.BagdetModel = (0, mongoose_1.model)('Badge', BadgeSchema);
