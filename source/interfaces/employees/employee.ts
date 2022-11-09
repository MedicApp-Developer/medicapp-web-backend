import { Document } from 'mongoose'

export default interface IEmployee extends Document {
  name: string
  email: string
  department: string
  salary: number
  emiratesId: string
  passportNo: string
  workEmail: string
  employeeAgreement: string
  passportPdf: string
  emiratesIdPdf: string
  visaPdf: string,
  profilePic: string
}