import { Document } from 'mongoose'

export default interface IHospital extends Document {
    name: string
    email: string
    tradeLicenseNo: string
    issueDate: string
    expiryDate: string
    tradeLicenseFile: string
    location: string
    phoneNo: string
    type: string
    category: string[]
    services: string[]
    images: string[]
    about: string
    openingTime: string
    closingTime: string
    PCRDPI: boolean
    status: string
}