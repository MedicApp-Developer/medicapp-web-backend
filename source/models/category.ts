import mongoose, { Schema } from 'mongoose'
import ICategory from '../interfaces/category'

const CategorySchema: Schema = new Schema(
    {
        name_en: {
            type: String,
            required: true
        },
        name_ar: {
            type: String,
            required: true
        }
    }
)

export default mongoose.model<ICategory>('Category', CategorySchema)