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
var makeResponse_1 = __importStar(require("../functions/makeResponse"));
var statusCode_1 = require("../constants/statusCode");
var speciality_1 = __importDefault(require("../models/doctors/speciality"));
var hospital_1 = __importDefault(require("../models/hospital/hospital"));
var category_1 = __importDefault(require("../models/category"));
var services_1 = __importDefault(require("../models/hospital/services"));
var slot_1 = __importDefault(require("../models/doctors/slot"));
var gender_1 = __importDefault(require("../models/lookups/gender"));
var language_1 = __importDefault(require("../models/lookups/language"));
var country_1 = __importDefault(require("../models/lookups/country"));
var NAMESPACE = "Home";
var getHomeData = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, lat, lng, specialities, hospitals, upcommingAppointments, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, lat = _a.lat, lng = _a.lng;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, speciality_1.default.find({}).sort({ 'order': 1 })];
            case 2:
                specialities = _b.sent();
                return [4 /*yield*/, hospital_1.default.find({
                        location: {
                            $near: {
                                $maxDistance: 5000,
                                $geometry: {
                                    type: "Point",
                                    coordinates: [lat, lng]
                                }
                            }
                        }
                    }).limit(10).skip(0)
                    // @ts-ignore
                ];
            case 3:
                hospitals = _b.sent();
                return [4 /*yield*/, slot_1.default.find({
                        patientId: res.locals.jwt.reference_id,
                        from: {
                            $gte: new Date()
                        }
                    }).select(['-hospitalId'])
                        .populate("patientId")
                        .populate({
                        path: 'doctorId',
                        populate: [
                            { path: 'specialityId' },
                            { path: 'hospitalId' }
                        ]
                    }).populate('familyMemberId')];
            case 4:
                upcommingAppointments = _b.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Patient Appointments", { upcommingAppointments: upcommingAppointments.length === 0 ? null : upcommingAppointments[0], specialities: specialities, hospitals: hospitals }, false)];
            case 5:
                err_1 = _b.sent();
                return [2 /*return*/, (0, makeResponse_1.sendErrorResponse)(res, 400, err_1.message, statusCode_1.SERVER_ERROR_CODE)];
            case 6: return [2 /*return*/];
        }
    });
}); };
var getFilters = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var specialities, hospitalCategories, hospitalServices, genderList, languageList, nationalityList, filters, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4 /*yield*/, speciality_1.default.find({}).sort({ 'order': 1 })];
            case 1:
                specialities = _a.sent();
                return [4 /*yield*/, category_1.default.find({})];
            case 2:
                hospitalCategories = _a.sent();
                return [4 /*yield*/, services_1.default.find({})];
            case 3:
                hospitalServices = _a.sent();
                return [4 /*yield*/, gender_1.default.find({})];
            case 4:
                genderList = _a.sent();
                return [4 /*yield*/, language_1.default.find({})];
            case 5:
                languageList = _a.sent();
                return [4 /*yield*/, country_1.default.find({})];
            case 6:
                nationalityList = _a.sent();
                filters = {
                    hospitalFilters: {
                        hospitalCategories: hospitalCategories,
                        hospitalServices: hospitalServices
                    },
                    doctorFilters: {
                        specialities: specialities,
                        genders: genderList,
                        languages: languageList,
                        nationalities: nationalityList
                    }
                };
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "All Filters", __assign({}, filters), false)];
            case 7:
                err_2 = _a.sent();
                return [2 /*return*/, (0, makeResponse_1.sendErrorResponse)(res, 400, err_2.message, statusCode_1.SERVER_ERROR_CODE)];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.default = {
    getHomeData: getHomeData,
    getFilters: getFilters
};
