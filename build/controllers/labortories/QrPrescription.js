"use strict";
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
var makeResponse_1 = __importDefault(require("../../functions/makeResponse"));
var QrPrescription_1 = __importDefault(require("../../models/labortories/QrPrescription"));
var html_pdf_1 = __importDefault(require("html-pdf"));
var Prescription_1 = __importDefault(require("../../documents/Prescription"));
var path_1 = __importDefault(require("path"));
var NAMESPACE = "QR Prescription";
var createQrPrescription = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patientId, doctorId, data, date, treatmentType, prescription, dosageADay, consumptionDays, qrPrescription;
    return __generator(this, function (_b) {
        _a = req.body, patientId = _a.patientId, doctorId = _a.doctorId, data = _a.data, date = _a.date, treatmentType = _a.treatmentType, prescription = _a.prescription, dosageADay = _a.dosageADay, consumptionDays = _a.consumptionDays;
        qrPrescription = new QrPrescription_1.default({ patientId: patientId, doctorId: doctorId, date: date, data: data, treatmentType: treatmentType, prescription: prescription, dosageADay: dosageADay, consumptionDays: consumptionDays });
        return [2 /*return*/, qrPrescription.save()
                .then(function (result) {
                return (0, makeResponse_1.default)(res, 201, "QR Prescription Created Successfully", result, false);
            })
                .catch(function (err) {
                return (0, makeResponse_1.default)(res, 400, err.message, null, true);
            })];
    });
}); };
var getQrPrescription = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        QrPrescription_1.default.find({ patientId: res.locals.jwt.reference_id })
            .populate({
            path: 'doctorId',
            populate: [
                { path: 'specialityId' },
                { path: 'hospitalId' }
            ]
        })
            .then(function (prescriptions) {
            return (0, makeResponse_1.default)(res, 201, "QR Prescription Created Successfully", prescriptions, false);
        }).catch(function (err) {
            return (0, makeResponse_1.default)(res, 400, err.message, null, true);
        });
        return [2 /*return*/];
    });
}); };
var getQRPrescriptionSlip = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, prescription, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, QrPrescription_1.default.find({ _id: id })
                        .populate('patientId')
                        .populate({
                        path: 'doctorId',
                        populate: [
                            { path: 'specialityId' },
                            { path: 'hospitalId' }
                        ]
                    })];
            case 2:
                prescription = _a.sent();
                html_pdf_1.default.create((0, Prescription_1.default)(prescription[0]), {}).toFile('Prescription.pdf', function (err) {
                    if (err) {
                        return Promise.reject();
                    }
                    return Promise.resolve().then(function (result) {
                        res.sendFile(path_1.default.resolve('Prescription.pdf'));
                    });
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                // @ts-ignore
                return [2 /*return*/, sendErrorResponse(res, 400, err_1.message, SERVER_ERROR_CODE)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.default = {
    createQrPrescription: createQrPrescription,
    getQrPrescription: getQrPrescription,
    getQRPrescriptionSlip: getQRPrescriptionSlip
};
