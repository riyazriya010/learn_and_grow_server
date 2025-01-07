import { Schema, model, Document } from "mongoose";

export interface IUserWallet extends Document {
  userId: Schema.Types.ObjectId;
  balance: number;
  transactions: {
    type: "credit" | "debit";
    amount: number;
    date: Date;
    description: string; // For what purpose (e.g., "Course Purchase", "Reward Conversion")
  }[];
}

const UserWalletSchema = new Schema<IUserWallet>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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

export const UserWalletModel = model<IUserWallet>("UserWallet", UserWalletSchema);
