import { Document } from 'mongoose';

export default interface IPatient extends Document {
    firstName: string;
    lastName: string;
    email: string;
    birthday: string;
    gender: string;
    emiratesId: string;
    // emiratesIdFile: string;
    issueDate: string;
    expiryDate: string;
    location: string;
    phone: string;
    lastVisit: string;
    patientId: string;
    weight: string;
    height: string;
    diseases: string[];
    allergies: string[];
    bloodType: string;
    age: number;
    temprature: string;
    heartRate: string;
    doctors?: string;
    image: string;
    points: number;
    likedPromos: string[];
}