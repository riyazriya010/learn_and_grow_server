"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminWalletModel = void 0;
const mongoose_1 = require("mongoose");
const AdminWalletSchema = new mongoose_1.Schema({
    adminId: { type: String, default: "admin" }, // Single admin account
    balance: { type: Number, default: 0 },
    transactions: [
        {
            type: { type: String, enum: ["credit", "debit"], required: true },
            amount: { type: Number, required: true },
            date: { type: Date, default: Date.now },
            courseName: { type: String, required: true },
        },
    ],
});
exports.AdminWalletModel = (0, mongoose_1.model)("AdminWallet", AdminWalletSchema);
