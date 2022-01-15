import mongoose, { Schema } from 'mongoose'
import ILookup from '../../interfaces/lookups/lookup'

const GenderSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true
		}
	}
)

export default mongoose.model<ILookup>('Gender', GenderSchema)
