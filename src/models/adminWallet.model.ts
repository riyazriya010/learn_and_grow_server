import { Schema, model, Document } from "mongoose";

export interface IAdminWallet extends Document {
  adminId: string; // For future extensibility if needed
  balance: number;
  transactions: {
    type: "credit" | "debit";
    amount: number;
    date: Date;
    courseName: string;
  }[];
}

const AdminWalletSchema = new Schema<IAdminWallet>({
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

export const AdminWalletModel = model<IAdminWallet>("AdminWallet", AdminWalletSchema);
