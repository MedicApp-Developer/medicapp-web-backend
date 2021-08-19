import { Document } from 'mongoose';

export default interface IHospital extends Document {
    name: string;
    tradeLicenseNo: string;
    issueDate: string;
    expiryDate: string;
    tradeLicense: string;
    location: string;
}