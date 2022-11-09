import { Document } from 'mongoose'

export default interface IEmployeeRequest extends Document {
  type: string
  from: string
  to: string
  reason: string
  employeeId: string,
  leavePdf: string
  status: boolean
}