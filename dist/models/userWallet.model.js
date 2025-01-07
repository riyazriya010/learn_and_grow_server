"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWalletModel = void 0;
const mongoose_1 = require("mongoose");
const UserWalletSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: 0 },
    transactions: [
        {
            type: { type: String, enum: ["credit", "debit"], required: true },
            amount: { type: Number, required: true },
            date: { type: Date, default: Date.now },
            description: { type: String, required: true },
        },
    ],
});
exports.UserWalletModel = (0, mongoose_1.model)("UserWallet", UserWalletSchema);
