import mongoose, { Schema } from 'mongoose'
import ISpeciality from '../../interfaces/doctors/speciality'

const SpecialitySchema: Schema = new Schema(
    {
        name_ar: {
            type: String,
            required: true
        },
        name_en: {
            type: String,
            required: true
        },
        tags: {
            type: String,
            required: true
        },
        logo: {
            type: String,
            required: false
        },
        order: {
            type: Number,
            required: false
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model<ISpeciality>('Speciality', SpecialitySchema)