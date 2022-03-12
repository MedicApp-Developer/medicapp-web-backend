import { Document } from 'mongoose';
export default interface IRewards extends Document {
	code: string;
	patientId: string;
	packageId: string;
	status: string;
}