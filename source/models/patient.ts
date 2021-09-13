import mongoose, { Schema } from 'mongoose';
import IPatient from '../interfaces/patient';

const PatientSchema: Schema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: { 
            type: String,
            required: true
        },
        email: { 
            type: String,
            required: true
        },
        birthday: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        emiratesIdFile: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: false
        },
        bloodType: {
            type: String,
            required: false
        },
        allergies: {
            type: String,
            required: false
        },
        diseases: {
            type: [String],
            required: false
        },
        height: {
            type: String,
            required: false
        },
        weight: {
            type: String,
            required: false
        },
        patientId: {
            type: String,
            required: false
        },
        lastVisit: {
            type: String,
            required: false
        }, 
        heartRate: {
            type: String,
            required: false
        },
        temprature: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IPatient>('Patient', PatientSchema);


// TODOS: make vitals relationship between patient ( One to One/Many )
/*
        currentMedicalRecord: {
            heartRate: {
                type: String,
                required: false
            },
            bodyTemprature: {
                type: String,
                required: false
            },
            glucose: {
                type: String,
                required: false
            }
        }
*/