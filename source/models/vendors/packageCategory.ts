import mongoose, { Schema } from 'mongoose';
import IPackageCategory from '../../interfaces/vendors/packageCategory';

const PackageCategorySchema: Schema = new Schema(
	{
		name_ar: {
			type: String,
			required: true
		},
		name_en: {
			type: String,
			required: true
		},
		image: {
			type: String,
		}
	},
	{
		timestamps: true
	}
);

export default mongoose.model<IPackageCategory>('PackageCategory', PackageCategorySchema);