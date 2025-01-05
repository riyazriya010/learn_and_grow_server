import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
    categoryName: string;
    isListed: boolean;
}

const CategorySchema = new Schema<ICategory>({
    categoryName: { type: String, required: true },
    isListed: { type: Boolean, default: true }
},{
    timestamps: true
}
)

export const CategoryModel = model<ICategory>('Category', CategorySchema)
