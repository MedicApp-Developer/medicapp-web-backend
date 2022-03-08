import { Document } from 'mongoose';
export default interface IUser extends Document {
	code: string;
	validity: boolean;
	patientId: string;
	vendorId: string;
	appointmentId: string;
}