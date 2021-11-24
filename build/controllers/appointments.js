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
exports.getDoctorAppointments = exports.getHospitalAppointments = exports.createAppointmentByNurse = void 0;
var appointment_1 = __importDefault(require("../models/appointment"));
var makeResponse_1 = __importDefault(require("../functions/makeResponse"));
var pagination_1 = require("../constants/pagination");
var NAMESPACE = "Appointment";
var createAppointment = function (req, res, next) {
    var _a = req.body, time = _a.time, doctorId = _a.doctorId, patientId = _a.patientId, hospitalId = _a.hospitalId;
    var newAppointment = new appointment_1.default({ time: time, doctorId: doctorId, patientId: patientId, hospitalId: hospitalId });
    newAppointment.save().then(function (result) {
        return makeResponse_1.default(res, 201, "Appointment Created Successfully", result, false);
    })
        .catch(function (err) {
        return makeResponse_1.default(res, 400, err.message, null, true);
    });
};
var getAllAppointments = function (req, res, next) {
    appointment_1.default.find({ patientId: res.locals.jwt.reference_id })
        .select(['-hospitalId'])
        .populate("patientId")
        .populate({
        path: 'doctorId',
        populate: [
            { path: 'specialityId' },
            { path: 'hospitalId' }
        ]
    })
        .then(function (result) {
        return makeResponse_1.default(res, 200, "All Appointments", result, false);
    })
        .catch(function (err) {
        return makeResponse_1.default(res, 400, err.message, null, true);
    });
};
var getSingleAppointment = function (req, res, next) {
    appointment_1.default.findById({ _id: req.params.id })
        .populate("doctorId")
        .populate("patientId")
        .then(function (data) {
        return makeResponse_1.default(res, 200, "Appointment", data, false);
    }).catch(function (err) {
        return makeResponse_1.default(res, 400, err.message, null, true);
    });
};
var updateAppointment = function (req, res, next) {
    var id = req.params.id;
    var filter = { _id: id };
    var update = __assign({}, req.body);
    appointment_1.default.findOneAndUpdate(filter, update).then(function (updatedAppointment) {
        return makeResponse_1.default(res, 200, "Appointment updated Successfully", updatedAppointment, false);
    }).catch(function (err) {
        return makeResponse_1.default(res, 400, err.message, null, true);
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
                return [4 /*yield*/, appointment_1.default.findByIdAndDelete(_id)];
            case 2:
                appointment = _a.sent();
                if (!appointment)
                    return [2 /*return*/, res.sendStatus(404)];
                return [2 /*return*/, makeResponse_1.default(res, 200, "Deleted Successfully", appointment, false)];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 4: return [2 /*return*/];
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
    appointment_1.default.find({ hospitalId: hospitalId })
        .populate("doctorId")
        .populate("patientId")
        .then(function (appointments) {
        return makeResponse_1.default(res, 200, "Hospital Appointments", appointments, false);
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
                return [4 /*yield*/, appointment_1.default.find({ doctorId: doctorId }).countDocuments({})];
            case 1:
                total = _a.sent();
                appointment_1.default.find({ doctorId: doctorId })
                    .populate("patientId")
                    .populate("doctorId")
                    .limit(pagination_1.Pagination.PAGE_SIZE)
                    .skip(pagination_1.Pagination.PAGE_SIZE * page)
                    .then(function (appointments) {
                    return makeResponse_1.default(res, 200, "Doctor Appointments", { totalItems: total, totalPages: Math.ceil(total / pagination_1.Pagination.PAGE_SIZE), appointments: appointments }, false);
                }).catch(function (err) {
                    return res.sendStatus(400);
                });
                return [2 /*return*/];
        }
    });
}); };
exports.getDoctorAppointments = getDoctorAppointments;
exports.default = {
    createAppointment: createAppointment,
    getAllAppointments: getAllAppointments,
    getSingleAppointment: getSingleAppointment,
    updateAppointment: updateAppointment,
    deleteAppointment: deleteAppointment,
    getHospitalAppointments: exports.getHospitalAppointments,
    getDoctorAppointments: exports.getDoctorAppointments
};
