"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var patient_1 = __importDefault(require("../models/patient"));
var makeResponse_1 = __importStar(require("../functions/makeResponse"));
var user_1 = __importDefault(require("../controllers/user"));
var roles_1 = require("../constants/roles");
var config_1 = __importDefault(require("../config/config"));
var appointment_1 = __importDefault(require("../models/appointment"));
var nurse_1 = __importDefault(require("../models/nurse/nurse"));
var user_2 = __importDefault(require("../models/user"));
var utilities_1 = require("../functions/utilities");
var mailer_1 = require("../functions/mailer");
var appointments_1 = require("./appointments");
var hospital_1 = __importDefault(require("../models/hospital/hospital"));
var pagination_1 = require("../constants/pagination");
var patientRegisteration_1 = require("../validation/patientRegisteration");
var statusCode_1 = require("../constants/statusCode");
var signJWT_1 = __importDefault(require("../functions/signJWT"));
var logging_1 = __importDefault(require("../config/logging"));
var NAMESPACE = "Patient";
var createPatient = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, firstName, lastName, email, birthday, gender, location, phone, password, _b, errors, isValid;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, firstName = _a.firstName, lastName = _a.lastName, email = _a.email, birthday = _a.birthday, gender = _a.gender, location = _a.location, phone = _a.phone, password = _a.password;
                _b = patientRegisteration_1.validatePatientRegisteration(req.body), errors = _b.errors, isValid = _b.isValid;
                // Check validation
                if (!isValid) {
                    // @ts-ignore
                    return [2 /*return*/, makeResponse_1.sendErrorResponse(res, 400, Object.values(errors)[0], Object.values(errors)[0].includes("invalid") ? INVALID_VALUE_CODE : statusCode_1.PARAMETER_MISSING_CODE)];
                }
                return [4 /*yield*/, user_2.default.find({ email: email }).then(function (result) {
                        if (result.length === 0) {
                            // @ts-ignore
                            var newPatient = new patient_1.default({
                                _id: new mongoose_1.default.Types.ObjectId(),
                                firstName: firstName, lastName: lastName, email: email, birthday: birthday, gender: gender, location: location, phone: phone,
                                // @ts-ignore
                                // emiratesIdFile: req.file.location
                            });
                            var options = {
                                from: config_1.default.mailer.user,
                                to: email,
                                subject: "Welcome to Medicapp",
                                text: "Your account account has been created as a patient, and your password is " + password
                            };
                            mailer_1.sendEmail(options);
                            return newPatient.save()
                                .then(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    user_1.default.createUserFromEmailAndPassword(req, res, email, password, firstName, lastName, roles_1.Roles.PATIENT, result._id);
                                    // @ts-ignore
                                    signJWT_1.default(result, function (_error, token) {
                                        if (_error) {
                                            logging_1.default.error(NAMESPACE, 'Unable to sign token: ', _error);
                                            return makeResponse_1.sendErrorResponse(res, 400, "Unauthorized", statusCode_1.UNAUTHORIZED_CODE);
                                        }
                                        else if (token) {
                                            return makeResponse_1.default(res, 200, "Patient registered successfully", { user: result, token: token }, false);
                                        }
                                    });
                                    return [2 /*return*/];
                                });
                            }); })
                                .catch(function (err) {
                                return makeResponse_1.sendErrorResponse(res, 400, err.message, statusCode_1.SERVER_ERROR_CODE);
                            });
                        }
                        else {
                            return makeResponse_1.sendErrorResponse(res, 400, "Email already exists", statusCode_1.DUPLICATE_VALUE_CODE);
                        }
                    })];
            case 1:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
var createPatientFromNurse = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, firstName, lastName, mobile, time, date, doctorId, referenceId, birthday, gender, location, password, nurse;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, firstName = _a.firstName, lastName = _a.lastName, mobile = _a.mobile, time = _a.time, date = _a.date, doctorId = _a.doctorId, referenceId = _a.referenceId, birthday = _a.birthday, gender = _a.gender, location = _a.location;
                password = utilities_1.getRandomPassword();
                return [4 /*yield*/, nurse_1.default.find({ _id: referenceId })];
            case 1:
                nurse = _b.sent();
                return [4 /*yield*/, user_2.default.find({ email: email }).then(function (result) {
                        if (result.length === 0) {
                            if (email && firstName && lastName && mobile) {
                                var newPatient = new patient_1.default({
                                    _id: new mongoose_1.default.Types.ObjectId(),
                                    birthday: birthday, gender: gender, location: location, email: email, password: password, firstName: firstName, lastName: lastName, mobile: mobile, hospitalId: nurse[0].hospitalId
                                });
                                var options = {
                                    from: config_1.default.mailer.user,
                                    to: email,
                                    subject: "Welcome to Medicapp",
                                    text: "Your account account has been created as a patient, and your password is " + password
                                };
                                mailer_1.sendEmail(options);
                                return newPatient.save()
                                    .then(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        user_1.default.createUserFromEmailAndPassword(req, res, email, password, firstName, lastName, roles_1.Roles.PATIENT, result._id);
                                        appointments_1.createAppointmentByNurse(req, res, next, time, doctorId, result._id, nurse[0].hospitalId);
                                        return [2 /*return*/, makeResponse_1.default(res, 201, "Patient Created Successfully", result, false)];
                                    });
                                }); })
                                    .catch(function (err) {
                                    return makeResponse_1.sendErrorResponse(res, 400, err.message, statusCode_1.SERVER_ERROR_CODE);
                                });
                            }
                            else {
                                return makeResponse_1.sendErrorResponse(res, 400, "Validation Failed", statusCode_1.SERVER_ERROR_CODE);
                            }
                        }
                        else {
                            return makeResponse_1.default(res, 400, "Email Already in use", null, true);
                        }
                    })];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
var getAllPatients = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, role, reference_id, _id, page, hospitalId, nurse, hospital, total_1, total_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = res.locals.jwt, role = _a.role, reference_id = _a.reference_id, _id = _a._id;
                page = parseInt(req.query.page || "0");
                hospitalId = null;
                if (!(role === roles_1.Roles.NURSE)) return [3 /*break*/, 2];
                return [4 /*yield*/, nurse_1.default.findById(reference_id)];
            case 1:
                nurse = _b.sent();
                hospitalId = nurse.hospitalId;
                return [3 /*break*/, 4];
            case 2:
                if (!(role === roles_1.Roles.HOSPITAL)) return [3 /*break*/, 4];
                return [4 /*yield*/, hospital_1.default.findById(reference_id)];
            case 3:
                hospital = _b.sent();
                hospitalId = hospital._id;
                _b.label = 4;
            case 4:
                if (!(role === roles_1.Roles.DOCTOR)) return [3 /*break*/, 6];
                return [4 /*yield*/, appointment_1.default.find({ doctorId: reference_id }).countDocuments({})];
            case 5:
                total_1 = _b.sent();
                appointment_1.default.find({ doctorId: reference_id }).limit(pagination_1.Pagination.PAGE_SIZE).skip(pagination_1.Pagination.PAGE_SIZE * page).populate('patientId')
                    .then(function (result) {
                    var patients = result.map(function (item) { return (item.patientId); });
                    return makeResponse_1.default(res, 200, "All Patients", { totalItems: total_1, totalPages: Math.ceil(total_1 / pagination_1.Pagination.PAGE_SIZE), patients: patients }, false);
                })
                    .catch(function (err) {
                    return makeResponse_1.sendErrorResponse(res, 400, err.message, statusCode_1.SERVER_ERROR_CODE);
                });
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, appointment_1.default.find({ hospitalId: hospitalId }).countDocuments({})];
            case 7:
                total_2 = _b.sent();
                appointment_1.default.find({ hospitalId: hospitalId }).limit(pagination_1.Pagination.PAGE_SIZE).skip(pagination_1.Pagination.PAGE_SIZE * page).populate('patientId')
                    .then(function (result) {
                    var patients = result.map(function (item) { return (item.patientId); });
                    return makeResponse_1.default(res, 200, "All Patients", { totalItems: total_2, totalPages: Math.ceil(total_2 / pagination_1.Pagination.PAGE_SIZE), patients: patients }, false);
                })
                    .catch(function (err) {
                    return makeResponse_1.sendErrorResponse(res, 400, err.message, statusCode_1.SERVER_ERROR_CODE);
                });
                _b.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
var getSinglePatient = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var doctors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                doctors = null;
                return [4 /*yield*/, appointment_1.default.find({ patientId: req.params.id }).populate('doctorId')
                        .then(function (result) {
                        doctors = result.map(function (item) { return (item.doctorId); });
                        patient_1.default.findById({ _id: req.params.id })
                            .then(function (data) {
                            var newTemp = JSON.parse(JSON.stringify(data));
                            newTemp.doctors = doctors;
                            return makeResponse_1.default(res, 200, "Patient", newTemp, false);
                        }).catch(function (err) {
                            return makeResponse_1.sendErrorResponse(res, 400, err.message, statusCode_1.SERVER_ERROR_CODE);
                        });
                    })
                        .catch(function (err) {
                        return makeResponse_1.sendErrorResponse(res, 400, err.message, statusCode_1.SERVER_ERROR_CODE);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var updatePatient = function (req, res, next) {
    var id = req.params.id;
    var filter = { _id: id };
    var update = __assign({}, req.body);
    patient_1.default.findOneAndUpdate(filter, update).then(function (updatedPatient) {
        return makeResponse_1.default(res, 200, "Patient updated Successfully", updatedPatient, false);
    }).catch(function (err) {
        return makeResponse_1.sendErrorResponse(res, 400, err.message, statusCode_1.SERVER_ERROR_CODE);
    });
};
var deletePatient = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, patient, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, patient_1.default.findByIdAndDelete(_id)];
            case 2:
                patient = _a.sent();
                if (!patient)
                    return [2 /*return*/, makeResponse_1.sendErrorResponse(res, 400, "Patient not found with this ID", statusCode_1.SERVER_ERROR_CODE)];
                return [4 /*yield*/, user_1.default.deleteUserWithEmail(patient.email)];
            case 3:
                _a.sent();
                return [4 /*yield*/, appointment_1.default.deleteMany({ patientId: patient._id })];
            case 4:
                _a.sent();
                return [2 /*return*/, makeResponse_1.default(res, 200, "Deleted Successfully", patient, false)];
            case 5:
                err_1 = _a.sent();
                // @ts-ignore
                return [2 /*return*/, makeResponse_1.sendErrorResponse(res, 400, err_1.message, statusCode_1.SERVER_ERROR_CODE)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.default = {
    createPatient: createPatient,
    getAllPatients: getAllPatients,
    getSinglePatient: getSinglePatient,
    updatePatient: updatePatient,
    deletePatient: deletePatient,
    createPatientFromNurse: createPatientFromNurse
};
