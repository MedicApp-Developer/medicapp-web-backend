import { Document } from 'mongoose';

export default interface IPharmacy extends Document {
    name: string;
    email: string;
    tradeLicenseNo: string;
    issueDate: string;
    expiryDate: string;
    tradeLicenseFile: string;
    noOfBranches: number;
}