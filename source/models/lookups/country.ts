import mongoose, { Schema } from 'mongoose'
import ILookup from '../../interfaces/lookups/Lookup'

const CountrySchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true
		}
	}
)

export default mongoose.model<ILookup>('Country', CountrySchema)
