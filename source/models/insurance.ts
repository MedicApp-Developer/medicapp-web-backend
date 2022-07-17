import mongoose, { Schema } from 'mongoose'
import IInsurance from '../interfaces/insurance'

const InsuranceSchema: Schema = new Schema(
    {
        name_ar: {
            type: String,
            required: true
        },
        name_en: {
            type: String,
            required: true
        },
        logo: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IInsurance>('Insurance', InsuranceSchema)