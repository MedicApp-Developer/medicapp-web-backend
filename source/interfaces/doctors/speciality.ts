import { Document } from 'mongoose'

export default interface ISpeciality extends Document {
    name_ar: string
    name_en: string
    logo: string
    order: number
}