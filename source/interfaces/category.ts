import { Document } from 'mongoose'

export default interface ICategory extends Document {
    name_en: string
    name_ar: string
}