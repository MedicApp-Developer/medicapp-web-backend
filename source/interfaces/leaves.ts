import { Document } from 'mongoose'

export default interface ILeave extends Document {
	patientId: string
	doctorId: string
	issuedDate: string
	from: string
	to: string
	description: string
}