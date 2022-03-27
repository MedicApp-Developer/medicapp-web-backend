import { Document } from 'mongoose';

export default interface IPackageCategory extends Document {
	name_ar: string;
	name_en: string;
	image: string;
}