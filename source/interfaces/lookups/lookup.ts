import { Document } from 'mongoose'

export default interface ILookup extends Document {
	name: string
}