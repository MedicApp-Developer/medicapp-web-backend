import mongoose, { Schema } from 'mongoose'
import IServices from '../../interfaces/hospitals/services'

const AddonSchema: Schema = new Schema(
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

export default mongoose.model<IServices>('Services', AddonSchema)