import { Document } from 'mongoose'

export default interface ILookup extends Document {
	name_en: string
	name_ar: string
}