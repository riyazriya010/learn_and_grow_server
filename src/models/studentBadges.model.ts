import { Schema, model, Document } from 'mongoose';

export interface IBadge extends Document {
    userId: Schema.Types.ObjectId;
    badgeId: Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const BadgeSchema = new Schema<IBadge>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    badgeId: { type: Schema.Types.ObjectId, ref: 'BadgeManagement', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
},{
    timestamps: true
}
)

export const BadgeModel = model<IBadge>('Badge', BadgeSchema)
