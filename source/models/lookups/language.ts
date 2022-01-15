import mongoose, { Schema } from 'mongoose'
import ILookup from '../../interfaces/lookups/lookup'

const LanguageSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true
		}
	}
)

export default mongoose.model<ILookup>('Language', LanguageSchema)
