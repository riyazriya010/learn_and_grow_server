import { Schema, model, Document } from 'mongoose';

export interface IBadge extends Document {
    badgeId: Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const BadgeSchema = new Schema<IBadge>({
    badgeId: { type: Schema.Types.ObjectId, ref: 'BadgeManagement', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
},{
    timestamps: true
}
)

export const BagdetModel = model<IBadge>('Badge', BadgeSchema)
