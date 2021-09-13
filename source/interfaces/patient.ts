import { Document } from 'mongoose';

export default interface IPatient extends Document {
    firstName: string;
    lastName: string;
    email: string;
    birthday: string;
    gender: string;
    emiratesIdFile: string;
    location: string;
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
}