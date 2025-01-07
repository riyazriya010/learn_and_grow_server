"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorWalletModel = void 0;
const mongoose_1 = require("mongoose");
const MentorWalletSchema = new mongoose_1.Schema({
    mentorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Mentors", required: true },
    balance: { type: Number, default: 0 },
    transactions: [
        {
            type: { type: String, enum: ["credit", "debit"], required: true },
            amount: { type: Number, required: true },
            date: { type: Date, default: Date.now },
            courseName: { type: String, required: true },
            adminCommission: { type: String, required: true },
        },
    ],
});
exports.MentorWalletModel = (0, mongoose_1.model)("MentorWallet", MentorWalletSchema);
