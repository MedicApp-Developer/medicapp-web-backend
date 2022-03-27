import { Document } from 'mongoose';

export default interface IPointsCode extends Document {
	code: string;
	status: string;
	patientId: string;
	hospitalId: string;
	slotId: string;
}