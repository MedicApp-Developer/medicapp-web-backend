import { Document } from 'mongoose';
export default interface IRewards extends Document {
	voucherCode: string;
	patientId: string;
	packageId: string;
	status: string;
}