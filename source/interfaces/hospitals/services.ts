import { Document } from 'mongoose'

export default interface IServices extends Document {
    name_en: string
    name_ar: string
}