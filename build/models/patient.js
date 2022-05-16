"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
var roles_1 = require("../constants/roles");
var PatientSchema = new mongoose_1.Schema({
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
        default: roles_1.Roles.PATIENT
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
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Patient', PatientSchema);
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
