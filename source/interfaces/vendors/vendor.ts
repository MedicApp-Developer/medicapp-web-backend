import { Document } from 'mongoose';

export default interface IVendor extends Document {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phoneNo: string;
	role: string;
	about: string;
	images: string[];
	referenceId: string;
	vendorId: string;
}