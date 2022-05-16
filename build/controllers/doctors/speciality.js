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
var speciality_1 = __importDefault(require("../../models/doctors/speciality"));
var makeResponse_2 = require("../../functions/makeResponse");
var statusCode_1 = require("../../constants/statusCode");
var speciality_2 = __importDefault(require("../../validation/speciality"));
var cloudinary_1 = __importDefault(require("cloudinary"));
var config_1 = __importDefault(require("../../config/config"));
var NAMESPACE = "Speciality";
var createSpeciality = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var result, _a, errors, isValid, _b, name_en, name_ar, tags, order, newSpeciality;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                // @ts-ignore
                cloudinary_1.default.v2.config({
                    cloud_name: config_1.default.cloudinary.name,
                    api_key: config_1.default.cloudinary.apiKey,
                    api_secret: config_1.default.cloudinary.secretKey
                });
                return [4 /*yield*/, cloudinary_1.default.uploader.upload(req.file.path)
                    // @ts-ignore
                ];
            case 1:
                result = _c.sent();
                _a = (0, speciality_2.default)(req.body), errors = _a.errors, isValid = _a.isValid;
                // Check validation
                if (!isValid) {
                    return [2 /*return*/, (0, makeResponse_1.default)(res, 400, "Validation Failed", errors, true)];
                }
                _b = req.body, name_en = _b.name_en, name_ar = _b.name_ar, tags = _b.tags, order = _b.order;
                newSpeciality = new speciality_1.default({ name_en: name_en, name_ar: name_ar, logo: result.url, tags: tags, order: parseInt(order) });
                newSpeciality.save().then(function (speciality) {
                    return (0, makeResponse_1.default)(res, 201, "Speciality Created Successfully", speciality, false);
                })
                    .catch(function (err) {
                    return (0, makeResponse_2.sendErrorResponse)(res, 400, "Unable to create speciality", statusCode_1.SERVER_ERROR_CODE);
                });
                return [2 /*return*/];
        }
    });
}); };
var getAllSpeciality = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var page, total_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(req.query.page !== "undefined")) return [3 /*break*/, 2];
                page = parseInt(req.query.page || "0");
                return [4 /*yield*/, speciality_1.default.find({}).countDocuments({})];
            case 1:
                total_1 = _a.sent();
                speciality_1.default.find({}).limit(6).skip(6 * page).sort({ 'order': 1 }).then(function (specialities) {
                    return (0, makeResponse_1.default)(res, 200, "All Specialities", { totalItems: total_1, totalPages: Math.ceil(total_1 / 6), specialities: specialities }, false);
                })
                    .catch(function (err) {
                    return (0, makeResponse_2.sendErrorResponse)(res, 400, "No Record Found", statusCode_1.RECORD_NOT_FOUND);
                });
                return [3 /*break*/, 3];
            case 2:
                speciality_1.default.find({}).sort({ order: 1 })
                    .then(function (specialities) {
                    return (0, makeResponse_1.default)(res, 200, "All Specialities", specialities, false);
                })
                    .catch(function (err) {
                    return (0, makeResponse_2.sendErrorResponse)(res, 400, "No Record Found", statusCode_1.RECORD_NOT_FOUND);
                });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var getSingleSpeciality = function (req, res, next) {
    speciality_1.default.findById({ _id: req.params.id })
        .then(function (data) {
        return (0, makeResponse_1.default)(res, 200, "Speciality", data, false);
    }).catch(function (err) {
        return (0, makeResponse_2.sendErrorResponse)(res, 400, "No Record Found", statusCode_1.RECORD_NOT_FOUND);
    });
};
var updateSpeciality = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, filter, update, result;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                // @ts-ignore
                cloudinary_1.default.v2.config({
                    cloud_name: config_1.default.cloudinary.name,
                    api_key: config_1.default.cloudinary.apiKey,
                    api_secret: config_1.default.cloudinary.secretKey
                });
                filter = { _id: id };
                update = {};
                if (!((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path)) return [3 /*break*/, 2];
                return [4 /*yield*/, cloudinary_1.default.uploader.upload(req.file.path)];
            case 1:
                result = _b.sent();
                update = { name_en: req.body.name_en, name_ar: req.body.name_ar, order: parseInt(req.body.order), tags: req.body.tags, logo: result.url };
                return [3 /*break*/, 3];
            case 2:
                update = { name_en: req.body.name_en, name_ar: req.body.name_ar, order: parseInt(req.body.order), tags: req.body.tags };
                _b.label = 3;
            case 3:
                speciality_1.default.findOneAndUpdate(filter, update).then(function (updatedSpeciality) {
                    return (0, makeResponse_1.default)(res, 200, "Speciality updated Successfully", updatedSpeciality, false);
                }).catch(function (err) {
                    return (0, makeResponse_2.sendErrorResponse)(res, 400, "Unable to update record", statusCode_1.SERVER_ERROR_CODE);
                });
                return [2 /*return*/];
        }
    });
}); };
var deleteSpeciality = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, speciality, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, speciality_1.default.findByIdAndDelete(_id)];
            case 2:
                speciality = _a.sent();
                if (!speciality)
                    return [2 /*return*/, res.sendStatus(404)];
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Deleted Successfully", speciality, false)];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, (0, makeResponse_2.sendErrorResponse)(res, 400, "Unable to delete record", statusCode_1.SERVER_ERROR_CODE)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.default = {
    createSpeciality: createSpeciality,
    getAllSpeciality: getAllSpeciality,
    getSingleSpeciality: getSingleSpeciality,
    updateSpeciality: updateSpeciality,
    deleteSpeciality: deleteSpeciality
};
