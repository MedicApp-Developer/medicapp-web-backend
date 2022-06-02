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
    image: string
    images: string[]
    about: string
    address: string
    openingTime: string
    closingTime: string
    PCRDPI: boolean
    status: string
}