import { Document } from 'mongoose'

export default interface IInsurance extends Document {
    name_ar: string
    name_en: string
    logo: string
}