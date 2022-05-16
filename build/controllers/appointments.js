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
exports.approvePatientAppointment = exports.getAllHospitalBookedAppointments = exports.getDoctorApprovedAppointments = exports.getDoctorAppointments = exports.getHospitalAppointments = exports.createAppointmentByNurse = void 0;
var appointment_1 = __importDefault(require("../models/appointment"));
var makeResponse_1 = __importStar(require("../functions/makeResponse"));
var pagination_1 = require("../constants/pagination");
var statusCode_1 = require("../constants/statusCode");
var slot_1 = __importDefault(require("../models/doctors/slot"));
var slot_2 = require("../constants/slot");
var patient_1 = __importDefault(require("../models/patient"));
var pointsCode_1 = __importDefault(require("../models/pointsCode"));
var rewards_1 = require("../constants/rewards");
var sendSms_1 = __importDefault(require("../functions/sendSms"));
var hospital_1 = __importDefault(require("../models/hospital/hospital"));
var doctor_1 = __importDefault(require("../models/doctors/doctor"));
var moment_1 = __importDefault(require("moment"));
var NAMESPACE = "Appointment";
var createAppointment = function (req, res, next) {
    var _a = req.body, patientId = _a.patientId, slotId = _a.slotId, description = _a.description, familyMemberId = _a.familyMemberId;
    if (patientId && slotId) {
        try {
            var filter = { _id: slotId };
            var update = { patientId: patientId, status: slot_2.SlotStatus.BOOKED, description: description, familyMemberId: familyMemberId };
            slot_1.default.findOneAndUpdate(filter, update, { upsert: true }).then(function (updatedSlot) { return __awaiter(void 0, void 0, void 0, function () {
                var slotInfo, hospitalInfo, doctorInfo, patientInfo, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, new pointsCode_1.default({
                                code: Math.floor(Math.random() * 10000000) + 1,
                                patientId: patientId,
                                // @ts-ignore
                                hospitalId: updatedSlot.hospitalId,
                                slotId: slotId
                            }).save()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, slot_1.default.findById(slotId)];
                        case 2:
                            slotInfo = _a.sent();
                            if (!slotInfo) return [3 /*break*/, 6];
                            return [4 /*yield*/, hospital_1.default.findById(slotInfo.hospitalId)];
                        case 3:
                            hospitalInfo = _a.sent();
                            return [4 /*yield*/, doctor_1.default.findById(slotInfo.doctorId)];
                        case 4:
                            doctorInfo = _a.sent();
                            return [4 /*yield*/, patient_1.default.findById(slotInfo.patientId)];
                        case 5:
                            patientInfo = _a.sent();
                            message = "Appointment Confirmed!\nPatient Name: ".concat((patientInfo === null || patientInfo === void 0 ? void 0 : patientInfo.firstName) + " " + (patientInfo === null || patientInfo === void 0 ? void 0 : patientInfo.lastName), "\nClinic Name: ").concat(hospitalInfo === null || hospitalInfo === void 0 ? void 0 : hospitalInfo.name, "\nDoctor Name: ").concat((doctorInfo === null || doctorInfo === void 0 ? void 0 : doctorInfo.firstName) + " " + (doctorInfo === null || doctorInfo === void 0 ? void 0 : doctorInfo.lastName), "\nDate & Time: ").concat((0, moment_1.default)(slotInfo === null || slotInfo === void 0 ? void 0 : slotInfo.from).format('MMMM Do YYYY, h:mm:ss a'), "\nClinic Location: ").concat(hospitalInfo === null || hospitalInfo === void 0 ? void 0 : hospitalInfo.address);
                            // @ts-ignore
                            (0, sendSms_1.default)(patientInfo === null || patientInfo === void 0 ? void 0 : patientInfo.phone.slice(1).replace(/\s+/g, ''), message);
                            _a.label = 6;
                        case 6: return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Appointment booked", updatedSlot, false)];
                    }
                });
            }); }).catch(function (err) {
                return (0, makeResponse_1.sendErrorResponse)(res, 400, "No slot with this ID", statusCode_1.RECORD_NOT_FOUND);
            });
        }
        catch (err) {
            return (0, makeResponse_1.sendErrorResponse)(res, 400, "Validation Failed", statusCode_1.SERVER_ERROR_CODE);
        }
    }
    else {
        return (0, makeResponse_1.sendErrorResponse)(res, 400, "Validation Failed", statusCode_1.PARAMETER_MISSING_CODE);
    }
};
var cancelAppointment = function (req, res, next) {
    var slotId = req.params.slotId;
    if (slotId) {
        try {
            var filter = { _id: slotId };
            var update = { patientId: null, status: slot_2.SlotStatus.AVAILABLE, description: "", familyMemberId: null, type: slot_2.SlotTypes.DOCTOR };
            // @ts-ignore
            slot_1.default.findOneAndUpdate(filter, update, { upsert: true }).then(function (updatedSlot) {
                return (0, makeResponse_1.default)(res, 200, "Updated Slot", updatedSlot, false);
            }).catch(function (err) {
                return (0, makeResponse_1.sendErrorResponse)(res, 400, "No slot with this ID", statusCode_1.RECORD_NOT_FOUND);
            });
        }
        catch (err) {
            return (0, makeResponse_1.sendErrorResponse)(res, 400, "Validation Failed Error", statusCode_1.SERVER_ERROR_CODE);
        }
    }
    else {
        return (0, makeResponse_1.sendErrorResponse)(res, 400, "Parameter missing", statusCode_1.PARAMETER_MISSING_CODE);
    }
};
var getAllAppointments = function (req, res, next) {
    slot_1.default.find({ patientId: res.locals.jwt.reference_id })
        .select(['-hospitalId'])
        .populate("patientId")
        .populate("familyMemberId")
        .populate({
        path: 'doctorId',
        populate: [
            { path: 'specialityId' },
            { path: 'hospitalId' }
        ]
    })
        .then(function (result) {
        return (0, makeResponse_1.default)(res, 200, "All Appointments", result, false);
    })
        .catch(function (err) {
        return (0, makeResponse_1.default)(res, 400, err.message, null, true);
    });
};
var getSingleAppointment = function (req, res, next) {
    slot_1.default.findById({ _id: req.params.id })
        .populate("doctorId")
        .populate("familyMemberId")
        .populate("patientId")
        .then(function (data) {
        return (0, makeResponse_1.default)(res, 200, "Appointment", data, false);
    }).catch(function (err) {
        return (0, makeResponse_1.default)(res, 400, err.message, null, true);
    });
};
var updateAppointment = function (req, res, next) {
    var id = req.params.id;
    var filter = { _id: id };
    var update = __assign({}, req.body);
    appointment_1.default.findOneAndUpdate(filter, update).then(function (updatedAppointment) {
        return (0, makeResponse_1.default)(res, 200, "Appointment updated Successfully", updatedAppointment, false);
    }).catch(function (err) {
        return (0, makeResponse_1.default)(res, 400, err.message, null, true);
    });
};
var deleteAppointment = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, appointment, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, slot_1.default.findByIdAndDelete(_id)];
            case 2:
                appointment = _a.sent();
                if (!appointment)
                    return [2 /*return*/, res.sendStatus(404)];
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Deleted Successfully", appointment, false)];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 4: return [2 /*return*/];
        }
    });
}); };
var deletePatientAppointment = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, patientId, slot, pointsCodeCount, newPatient_1, filter, update, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = req.params.id;
                patientId = req.params.patientId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                return [4 /*yield*/, slot_1.default.findById({ _id: _id })];
            case 2:
                slot = _a.sent();
                return [4 /*yield*/, pointsCode_1.default.find({ slotId: slot === null || slot === void 0 ? void 0 : slot._id, status: rewards_1.POINTS_CODE.TAKEN }).countDocuments()];
            case 3:
                pointsCodeCount = _a.sent();
                newPatient_1 = null;
                if (!(pointsCodeCount > 0)) return [3 /*break*/, 5];
                return [4 /*yield*/, patient_1.default.findOneAndUpdate({ _id: patientId }, { $inc: { points: -20 } }, { new: true })];
            case 4:
                newPatient_1 = _a.sent();
                _a.label = 5;
            case 5: return [4 /*yield*/, pointsCode_1.default.deleteOne({ slotId: _id })];
            case 6:
                _a.sent();
                filter = { _id: _id };
                update = { patientId: null, status: slot_2.SlotStatus.AVAILABLE, description: "", familyMemberId: null };
                // @ts-ignore
                return [4 /*yield*/, slot_1.default.findOneAndUpdate(filter, update, { upsert: true })];
            case 7:
                // @ts-ignore
                _a.sent();
                slot_1.default.findById(_id).then(function (response) {
                    slot_1.default.find({ patientId: patientId })
                        .populate("patientId")
                        .populate("hospitalId")
                        .populate("familyMemberId")
                        .populate({
                        path: 'doctorId',
                        populate: [
                            { path: 'specialityId' },
                            { path: 'hospitalId' }
                        ]
                    }).then(function (upcommingAppointments) {
                        return (0, makeResponse_1.default)(res, 200, "Patient Appointments", { upcommingAppointments: upcommingAppointments, newPatient: newPatient_1 }, false);
                    });
                });
                return [3 /*break*/, 9];
            case 8:
                err_1 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 9: return [2 /*return*/];
        }
    });
}); };
var createAppointmentByNurse = function (req, res, next, time, doctorId, patientId, hospitalId) {
    var newAppointment = new appointment_1.default({ time: time, doctorId: doctorId, patientId: patientId, hospitalId: hospitalId });
    newAppointment.save().then(function (result) {
        return true;
    })
        .catch(function (err) {
        return false;
    });
};
exports.createAppointmentByNurse = createAppointmentByNurse;
var getHospitalAppointments = function (req, res, next) {
    var hospitalId = req.params.hospitalId;
    slot_1.default.find({ hospitalId: hospitalId })
        .populate({
        path: 'doctorId',
        populate: [
            { path: 'specialityId' },
            { path: 'hospitalId' }
        ]
    })
        .populate("familyMemberId")
        .populate("patientId")
        .then(function (appointments) {
        return (0, makeResponse_1.default)(res, 200, "Hospital Appointments", appointments, false);
    }).catch(function (err) {
        return res.sendStatus(400);
    });
};
exports.getHospitalAppointments = getHospitalAppointments;
var getDoctorAppointments = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var doctorId, page, total;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                doctorId = req.params.doctorId;
                page = parseInt(req.query.page || "0");
                return [4 /*yield*/, slot_1.default.find({ doctorId: doctorId }).countDocuments({})];
            case 1:
                total = _a.sent();
                slot_1.default.find({ doctorId: doctorId })
                    .populate("patientId")
                    .populate("familyMemberId")
                    .populate("doctorId")
                    .limit(pagination_1.Pagination.PAGE_SIZE)
                    .skip(pagination_1.Pagination.PAGE_SIZE * page)
                    .then(function (appointments) {
                    return (0, makeResponse_1.default)(res, 200, "Doctor Appointments", { totalItems: total, totalPages: Math.ceil(total / pagination_1.Pagination.PAGE_SIZE), appointments: appointments }, false);
                }).catch(function (err) {
                    return res.sendStatus(400);
                });
                return [2 /*return*/];
        }
    });
}); };
exports.getDoctorAppointments = getDoctorAppointments;
var getDoctorApprovedAppointments = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var doctorId, page, total;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                doctorId = req.params.doctorId;
                page = parseInt(req.query.page || "0");
                return [4 /*yield*/, slot_1.default.find({ doctorId: doctorId, status: slot_2.SlotStatus.BOOKED }).countDocuments({})];
            case 1:
                total = _a.sent();
                slot_1.default.find({ doctorId: doctorId, status: slot_2.SlotStatus.BOOKED })
                    .populate("patientId")
                    .populate("familyMemberId")
                    .populate("doctorId")
                    .limit(pagination_1.Pagination.PAGE_SIZE)
                    .skip(pagination_1.Pagination.PAGE_SIZE * page)
                    .then(function (appointments) {
                    return (0, makeResponse_1.default)(res, 200, "Doctor BOOKED Appointments", { totalItems: total, totalPages: Math.ceil(total / pagination_1.Pagination.PAGE_SIZE), appointments: appointments }, false);
                }).catch(function (err) {
                    return res.sendStatus(400);
                });
                return [2 /*return*/];
        }
    });
}); };
exports.getDoctorApprovedAppointments = getDoctorApprovedAppointments;
var getAllHospitalBookedAppointments = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var hospitalId, page, total;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                hospitalId = req.params.hospitalId;
                page = parseInt(req.query.page || "0");
                return [4 /*yield*/, slot_1.default.find({ hospitalId: hospitalId, status: slot_2.SlotStatus.BOOKED }).countDocuments({})];
            case 1:
                total = _a.sent();
                slot_1.default.find({ hospitalId: hospitalId, status: slot_2.SlotStatus.BOOKED })
                    .populate("patientId")
                    .populate("familyMemberId")
                    .populate("doctorId")
                    .limit(pagination_1.Pagination.PAGE_SIZE)
                    .skip(pagination_1.Pagination.PAGE_SIZE * page)
                    .then(function (appointments) {
                    return (0, makeResponse_1.default)(res, 200, "Hospital's Appointments", { totalItems: total, totalPages: Math.ceil(total / pagination_1.Pagination.PAGE_SIZE), appointments: appointments }, false);
                }).catch(function (err) {
                    return res.sendStatus(400);
                });
                return [2 /*return*/];
        }
    });
}); };
exports.getAllHospitalBookedAppointments = getAllHospitalBookedAppointments;
var approvePatientAppointment = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, slotId, patientId, filter, update, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, slotId = _a.slotId, patientId = _a.patientId;
                if (!(slotId && patientId)) return [3 /*break*/, 6];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                filter = { _id: slotId };
                update = { status: slot_2.SlotStatus.APPROVED };
                // @ts-ignore
                return [4 /*yield*/, slot_1.default.findOneAndUpdate(filter, update, { upsert: true })];
            case 2:
                // @ts-ignore
                _b.sent();
                return [4 /*yield*/, patient_1.default.findOneAndUpdate({ _id: patientId }, { $inc: { points: 20 } }, { new: true })];
            case 3:
                _b.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Hospital's Appointments", null, false)];
            case 4:
                err_2 = _b.sent();
                return [2 /*return*/, (0, makeResponse_1.sendErrorResponse)(res, 400, "Validation Failed Error", statusCode_1.SERVER_ERROR_CODE)];
            case 5: return [3 /*break*/, 7];
            case 6: return [2 /*return*/, (0, makeResponse_1.sendErrorResponse)(res, 400, "Parameter missing", statusCode_1.PARAMETER_MISSING_CODE)];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.approvePatientAppointment = approvePatientAppointment;
exports.default = {
    createAppointment: createAppointment,
    getAllAppointments: getAllAppointments,
    getSingleAppointment: getSingleAppointment,
    updateAppointment: updateAppointment,
    deleteAppointment: deleteAppointment,
    getHospitalAppointments: exports.getHospitalAppointments,
    getDoctorAppointments: exports.getDoctorAppointments,
    deletePatientAppointment: deletePatientAppointment,
    cancelAppointment: cancelAppointment,
    getAllHospitalBookedAppointments: exports.getAllHospitalBookedAppointments,
    approvePatientAppointment: exports.approvePatientAppointment,
    getDoctorApprovedAppointments: exports.getDoctorApprovedAppointments
};
