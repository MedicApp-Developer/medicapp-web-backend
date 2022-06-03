import mongoose, { Schema } from 'mongoose';
import { Roles } from '../constants/roles';
import IPatient from '../interfaces/patient/patient';

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
        emiratesId: {
            type: String,
            required: false,
            default: null
        },
        image: {
            type: String,
            required: false,
            default: ""
        },
        role: {
            type: String,
            default: Roles.PATIENT
        },
        // emiratesIdFile: {
        //     type: String,
        //     required: false
        // },
        birthday: {
            type: String,
            required: false,
            default: null
        },
        gender: {
            type: String,
            required: false,
            default: null
        },
        // issueDate: {
        //     type: String,
        //     required: true
        // },
        // expiryDate: {
        //     type: String,
        //     required: true
        // },
        location: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: false,
            default: null
        },
        bloodType: {
            type: String,
            required: false,
            default: null
        },
        allergies: {
            type: [String],
            required: false,
            default: null
        },
        diseases: {
            type: [String],
            required: false,
            default: null
        },
        likedPromos: {
            type: [String],
            required: false
        },
        height: {
            type: String,
            required: false,
            default: null
        },
        weight: {
            type: String,
            required: false,
            default: null
        },
        patientId: {
            type: String,
            required: false
        },
        lastVisit: {
            type: String,
            required: false,
            default: null
        },
        heartRate: {
            type: String,
            required: false,
            default: null
        },
        temprature: {
            type: String,
            required: false,
            default: null
        },
        glucose: {
            type: String,
            required: false,
            default: null
        },
        points: {
            type: Number,
            required: false,
            default: 0
        },

        // account deletion
        accountDeletionRequest: {
            type: Boolean,
            required: false,
            default: false
        },
        deletionDate: {
            type: String,
            required: false,
            default: null
        },
        webFctoken: {
            type: String,
            required: false,
            default: false
        },
        mobileFctoken: {
            type: String,
            required: false,
            default: false
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