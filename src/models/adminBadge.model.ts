import { Schema, model, Document } from 'mongoose';

export interface IBadgeManagement extends Document {
    badgeName: string;
    description: string;
    value: string;
    isListed: boolean;
}

const BadgeManagementSchema = new Schema<IBadgeManagement>({
    badgeName: { type: String, required: true },
    description: { type: String, required: true },
    value: { type: String, required: true },
    isListed: { type: Boolean, default: true }
},{
    timestamps: true
}
)

export const BagdeManagementModel = model<IBadgeManagement>('BadgeManagement', BadgeManagementSchema)
