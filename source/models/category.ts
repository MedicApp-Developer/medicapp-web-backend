import mongoose, { Schema } from 'mongoose';
import ICategory from '../interfaces/category';

const CategorySchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    }
);

export default mongoose.model<ICategory>('Category', CategorySchema);