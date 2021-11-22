import { Document } from 'mongoose';

export default interface IDoctor extends Document {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    hospitalId: string;
    specialityId: string;
    experience: string;
    description: string;
    about: string;
    image: string;
    schedule: {
        monday: {
            startTime: string;
            endTime: string;
        },
        tuesday: {
            startTime: string;
            endTime: string;
        },
        wednesday: {
            startTime: string;
            endTime: string;
        },
        thursday: {
            startTime: string;
            endTime: string;
        },
        friday: {
            startTime: string;
            endTime: string;
        },
        satureday: {
            startTime: string;
            endTime: string;
        },
        sunday: {
            startTime: string;
            endTime: string;
        }
    }
}