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
var mongoose_1 = __importDefault(require("mongoose"));
var doctor_1 = __importDefault(require("../../models/doctors/doctor"));
var user_1 = __importDefault(require("../../models/user"));
var makeResponse_1 = __importDefault(require("../../functions/makeResponse"));
var user_2 = __importDefault(require("../user"));
var roles_1 = require("../../constants/roles");
var mailer_1 = require("../../functions/mailer");
var utilities_1 = require("../../functions/utilities");
var config_1 = __importDefault(require("../../config/config"));
var pagination_1 = require("../../constants/pagination");
var nurse_1 = __importDefault(require("../../models/nurse/nurse"));
var hospital_1 = __importDefault(require("../../models/hospital/hospital"));
var NAMESPACE = "Doctor";
var createDoctor = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, firstName, lastName, mobile, specialityId, experience, password;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, firstName = _a.firstName, lastName = _a.lastName, mobile = _a.mobile, specialityId = _a.specialityId, experience = _a.experience;
                password = utilities_1.getRandomPassword();
                return [4 /*yield*/, user_1.default.find({ email: email }).then(function (result) {
                        if (result.length === 0) {
                            if (email && firstName && lastName && mobile) {
                                var newDoctor = new doctor_1.default({
                                    _id: new mongoose_1.default.Types.ObjectId(),
                                    experience: experience, specialityId: specialityId,
                                    email: email, password: password, firstName: firstName, lastName: lastName, mobile: mobile, hospitalId: res.locals.jwt.reference_id
                                });
                                var options = {
                                    from: config_1.default.mailer.user,
                                    to: email,
                                    subject: "Welcome to Medicapp",
                                    text: "Your account account has been created as a doctor, and your password is " + password
                                };
                                mailer_1.sendEmail(options);
                                return newDoctor.save()
                                    .then(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, user_2.default.createUserFromEmailAndPassword(req, res, email, password, firstName, lastName, "", roles_1.Roles.DOCTOR, result._id)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/, makeResponse_1.default(res, 201, "Doctor Created Successfully", result, false)];
                                        }
                                    });
                                }); })
                                    .catch(function (err) {
                                    return makeResponse_1.default(res, 400, err.message, null, true);
                                });
                            }
                            else {
                                return makeResponse_1.default(res, 400, "Validation Failed", null, true);
                            }
                        }
                        else {
                            return makeResponse_1.default(res, 400, "Email Already in use", null, true);
                        }
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
var getAllDoctors = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var page, hospitalId, total_1, reference_id, nurse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                page = parseInt(req.query.page || "0");
                hospitalId = null;
                if (!(res.locals.jwt.role === roles_1.Roles.HOSPITAL)) return [3 /*break*/, 2];
                hospitalId = res.locals.jwt.reference_id;
                return [4 /*yield*/, doctor_1.default.find({ hospitalId: hospitalId }).countDocuments({})];
            case 1:
                total_1 = _a.sent();
                doctor_1.default.find({ hospitalId: hospitalId }).populate("specialityId").limit(pagination_1.Pagination.PAGE_SIZE).skip(pagination_1.Pagination.PAGE_SIZE * page)
                    .then(function (result) {
                    return makeResponse_1.default(res, 200, "All Doctors", { totalItems: total_1, totalPages: Math.ceil(total_1 / pagination_1.Pagination.PAGE_SIZE), doctors: result }, false);
                })
                    .catch(function (err) {
                    return makeResponse_1.default(res, 400, err.message, null, true);
                });
                return [3 /*break*/, 4];
            case 2:
                if (!(res.locals.jwt.role === roles_1.Roles.NURSE)) return [3 /*break*/, 4];
                reference_id = req.query.reference_id;
                return [4 /*yield*/, nurse_1.default.findById(reference_id)];
            case 3:
                nurse = _a.sent();
                hospitalId = nurse === null || nurse === void 0 ? void 0 : nurse.hospitalId;
                doctor_1.default.find({ hospitalId: hospitalId }).populate("specialityId")
                    .then(function (result) {
                    return makeResponse_1.default(res, 200, "All Doctors", { doctors: result }, false);
                })
                    .catch(function (err) {
                    return makeResponse_1.default(res, 400, err.message, null, true);
                });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
var getSingleDoctor = function (req, res, next) {
    doctor_1.default.findById({ _id: req.params.id }).populate('hospitalId').populate("specialityId")
        .then(function (data) {
        return makeResponse_1.default(res, 200, "Doctor", data, false);
    }).catch(function (err) {
        return makeResponse_1.default(res, 400, err.message, null, true);
    });
};
var updateDoctor = function (req, res, next) {
    var _id = res.locals.jwt._id;
    // This id is updated hospital itself id 
    var id = req.params.id;
    var update = JSON.parse(JSON.stringify(__assign({}, req.body)));
    update.password && delete update.password;
    var filter = { _id: id };
    user_2.default.updateUser(req, res, _id, req.body);
    doctor_1.default.findOneAndUpdate(filter, update).then(function (updatedDoctor) {
        return makeResponse_1.default(res, 200, "Doctor updated Successfully", updatedDoctor, false);
    }).catch(function (err) {
        return makeResponse_1.default(res, 400, err.message, null, true);
    });
};
var deleteDoctor = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, doctor, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, doctor_1.default.findByIdAndDelete(_id)];
            case 2:
                doctor = _a.sent();
                if (!doctor)
                    return [2 /*return*/, res.sendStatus(404)];
                return [4 /*yield*/, user_2.default.deleteUserWithEmail(doctor.email)];
            case 3:
                _a.sent();
                return [2 /*return*/, makeResponse_1.default(res, 200, "Deleted Successfully", doctor, false)];
            case 4:
                e_1 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 5: return [2 /*return*/];
        }
    });
}); };
var searchDoctor = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var searchedText, page, searchedTextRegex, searchQuery, total;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                searchedText = req.params.searchedText;
                page = parseInt(req.query.page || "0");
                searchedTextRegex = new RegExp(searchedText, 'i');
                searchQuery = [
                    { firstName: searchedTextRegex },
                    { lastName: searchedTextRegex },
                    { email: searchedTextRegex },
                    { mobile: searchedTextRegex }
                ];
                return [4 /*yield*/, doctor_1.default.find({ $and: [{ $or: searchQuery }, { hospitalId: res.locals.jwt.reference_id }] }).countDocuments({})];
            case 1:
                total = _a.sent();
                doctor_1.default.find({ $and: [{ $or: searchQuery }, { hospitalId: res.locals.jwt.reference_id }] }).limit(pagination_1.Pagination.PAGE_SIZE).skip(pagination_1.Pagination.PAGE_SIZE * page)
                    .then(function (result) {
                    return makeResponse_1.default(res, 200, "Search Results", { searchedText: searchedText, totalItems: total, totalPages: Math.ceil(total / pagination_1.Pagination.PAGE_SIZE), doctors: result }, false);
                }).catch(function (err) {
                    return makeResponse_1.default(res, 400, "No doctor found", null, true);
                });
                return [2 /*return*/];
        }
    });
}); };
var searchHospitalAndDoctor = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var searchedText, searchedTextRegex, hospitalSearchQuery, doctorSearchQuery, searchedHospitals, searchedDoctors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                searchedText = req.params.searchedText;
                searchedTextRegex = new RegExp(searchedText, 'i');
                hospitalSearchQuery = [
                    { name: searchedTextRegex },
                    { location: searchedTextRegex },
                    { email: searchedTextRegex },
                    { tradeLicenseNo: searchedTextRegex }
                ];
                doctorSearchQuery = [
                    { firstName: searchedTextRegex },
                    { lastName: searchedTextRegex },
                    { email: searchedTextRegex },
                    { mobile: searchedTextRegex }
                ];
                return [4 /*yield*/, hospital_1.default.find({ $or: hospitalSearchQuery })];
            case 1:
                searchedHospitals = _a.sent();
                return [4 /*yield*/, doctor_1.default.find({ $or: doctorSearchQuery })];
            case 2:
                searchedDoctors = _a.sent();
                return [2 /*return*/, makeResponse_1.default(res, 200, "Search Results", { hospital: searchedHospitals, doctor: searchedDoctors }, false)];
        }
    });
}); };
var searchDoctorBySpeciality = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        doctor_1.default.find({ specialityId: req.params.specialityId }).populate("specialityId")
            .then(function (data) {
            return makeResponse_1.default(res, 200, "Searched Doctor", data, false);
        }).catch(function (err) {
            return makeResponse_1.default(res, 400, err.message, null, true);
        });
        return [2 /*return*/];
    });
}); };
exports.default = {
    createDoctor: createDoctor,
    getAllDoctors: getAllDoctors,
    getSingleDoctor: getSingleDoctor,
    updateDoctor: updateDoctor,
    deleteDoctor: deleteDoctor,
    searchDoctor: searchDoctor,
    searchHospitalAndDoctor: searchHospitalAndDoctor,
    searchDoctorBySpeciality: searchDoctorBySpeciality
};
