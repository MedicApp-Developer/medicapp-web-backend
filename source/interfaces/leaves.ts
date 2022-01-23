import { Document } from 'mongoose'

export default interface ILeave extends Document {
	patientId: string
	doctorId: string
	days: number
	description: string
}