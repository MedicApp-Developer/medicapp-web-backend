import { Document } from 'mongoose'

export default interface ICheckin extends Document {
  checkin: string
  checkout: string
  date: string
  employeeId: string
}