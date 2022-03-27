import { Document } from 'mongoose';

export default interface IPackage extends Document {
	type: string;
	points: string;
	buyQuantity: string;
	getQuantity: string;
	off: string;
	category_id: string;
	about: string;
	termsAndConditions: string;
	images: string[];
	vendorId: string;
	subscribedCount: number;
}