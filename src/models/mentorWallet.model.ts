import { Schema, model, Document } from "mongoose";

export interface IMentorWallet extends Document {
  mentorId: Schema.Types.ObjectId;
  balance: number;
  transactions: {
    type: "credit" | "debit";
    amount: number;
    date: Date;
    courseName: string;
    adminCommission: string;
  }[];
}

const MentorWalletSchema = new Schema<IMentorWallet>({
  mentorId: { type: Schema.Types.ObjectId, ref: "Mentors", required: true },
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

export const MentorWalletModel = model<IMentorWallet>("MentorWallet", MentorWalletSchema);
