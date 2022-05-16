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
var logging_1 = __importDefault(require("../config/logging"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var mongoose_1 = __importDefault(require("mongoose"));
var user_1 = __importDefault(require("../models/user"));
var signJWT_1 = __importDefault(require("../functions/signJWT"));
var makeResponse_1 = __importStar(require("../functions/makeResponse"));
var login_1 = __importDefault(require("../validation/login"));
var statusCode_1 = require("../constants/statusCode");
var roles_1 = require("../constants/roles");
var patient_1 = __importDefault(require("../models/patient"));
var bookmark_1 = __importDefault(require("../models/bookmark"));
var family_1 = __importDefault(require("../models/family"));
var hospital_1 = __importDefault(require("../models/hospital/hospital"));
var mailer_1 = require("../functions/mailer");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var NAMESPACE = "User";
var validateToken = function (req, res, next) {
    logging_1.default.info(NAMESPACE, "Token validated, user authenticated");
    return res.status(200).json({
        message: "Authorized"
    });
};
var register = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, firstName, lastName, email, password;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, firstName = _a.firstName, lastName = _a.lastName, email = _a.email, password = _a.password;
                if (!firstName || !lastName || !email || !password) {
                    return [2 /*return*/, (0, makeResponse_1.sendErrorResponse)(res, 400, "Parameter missing", statusCode_1.PARAMETER_MISSING_CODE)];
                }
                return [4 /*yield*/, user_1.default.find({ email: email }).exec().then(function (user) {
                        if (user.length > 0) {
                            return (0, makeResponse_1.sendErrorResponse)(res, 400, "User with this email already exists", statusCode_1.DUPLICATE_VALUE_CODE);
                        }
                        // If email is valid
                        bcryptjs_1.default.hash(password, 10, function (hashError, hash) { return __awaiter(void 0, void 0, void 0, function () {
                            var _user;
                            return __generator(this, function (_a) {
                                if (hashError) {
                                    return [2 /*return*/, false];
                                }
                                _user = new user_1.default({
                                    _id: new mongoose_1.default.Types.ObjectId(),
                                    firstName: firstName,
                                    lastName: lastName,
                                    email: email,
                                    password: hash,
                                    role: roles_1.Roles.ADMIN,
                                    emiratesId: "",
                                    referenceId: null
                                });
                                _user.save().then(function (user) {
                                    return (0, makeResponse_1.default)(res, 200, "Authentication Successful", { user: user }, false);
                                }).catch(function (err) { return console.log(err); });
                                return [2 /*return*/];
                            });
                        }); });
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
var login = function (req, res, next) {
    // Form validation
    var _a = (0, login_1.default)(req.body), errors = _a.errors, isValid = _a.isValid;
    // Check validation
    if (!isValid) {
        // @ts-ignore
        return (0, makeResponse_1.sendErrorResponse)(res, 400, Object.values(errors)[0], Object.values(errors)[0].includes("invalid") ? statusCode_1.INVALID_VALUE_CODE : statusCode_1.PARAMETER_MISSING_CODE);
    }
    var _b = req.body, email = _b.email, password = _b.password;
    user_1.default.find({ email: email })
        .exec()
        .then(function (users) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (users.length !== 1) {
                return [2 /*return*/, (0, makeResponse_1.sendErrorResponse)(res, 400, "Unauthorized", statusCode_1.UNAUTHORIZED_CODE)];
            }
            bcryptjs_1.default.compare(password, users[0].password, function (error, result) {
                if (!result) {
                    return (0, makeResponse_1.sendErrorResponse)(res, 400, "Unauthorized", statusCode_1.UNAUTHORIZED_CODE);
                }
                else if (result) {
                    (0, signJWT_1.default)(users[0], function (_error, token) { return __awaiter(void 0, void 0, void 0, function () {
                        var patient, familyMembers, bookmarks, hospital;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!_error) return [3 /*break*/, 1];
                                    logging_1.default.error(NAMESPACE, 'Unable to sign token: ', _error);
                                    return [2 /*return*/, (0, makeResponse_1.sendErrorResponse)(res, 400, "Unauthorized", statusCode_1.UNAUTHORIZED_CODE)];
                                case 1:
                                    if (!token) return [3 /*break*/, 8];
                                    if (!(users[0].role === roles_1.Roles.PATIENT)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, patient_1.default.findById(users[0].referenceId)];
                                case 2:
                                    patient = _a.sent();
                                    return [4 /*yield*/, family_1.default.find({ patientId: users[0].referenceId })];
                                case 3:
                                    familyMembers = _a.sent();
                                    return [4 /*yield*/, bookmark_1.default.find({ user: users[0]._id }).select("hospitalIds doctorIds")];
                                case 4:
                                    bookmarks = _a.sent();
                                    return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Authentication Successful", { bookmarks: bookmarks.length > 0 ? bookmarks[0] : { doctorIds: [], hospitalIds: [] }, user: patient, familyMembers: familyMembers.length > 0 ? familyMembers : [], token: token }, false)];
                                case 5:
                                    if (!(users[0].role === roles_1.Roles.HOSPITAL)) return [3 /*break*/, 7];
                                    return [4 /*yield*/, hospital_1.default.findById(users[0].referenceId)];
                                case 6:
                                    hospital = _a.sent();
                                    if (users[0].status === roles_1.UserStatus.APPROVED) {
                                        return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Authentication Successful", { user: users[0], hospital: hospital, token: token }, false)];
                                    }
                                    else {
                                        return [2 /*return*/, (0, makeResponse_1.default)(res, 400, "Your status is still Pending, contact Medicapp Admin to get approved", null, true)];
                                    }
                                    return [3 /*break*/, 8];
                                case 7: return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Authentication Successful", { user: users[0], token: token }, false)];
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); });
                }
            });
            return [2 /*return*/];
        });
    }); }).catch(function (error) {
        return (0, makeResponse_1.default)(res, 400, error.message, null, true);
    });
};
var getAllUsers = function (req, res, next) {
    user_1.default.find().select("-password").exec()
        .then(function (users) {
        return (0, makeResponse_1.default)(res, 200, "Users List", users, false);
    })
        .catch(function (error) {
        return (0, makeResponse_1.default)(res, 400, error.message, null, true);
    });
};
var deleteUser = function (req, res, next) {
    user_1.default.deleteOne({ _id: req.params.id }).then(function (user) {
        return (0, makeResponse_1.default)(res, 200, "User Deleted Successfully", null, false);
    }).catch(function (err) {
        return (0, makeResponse_1.default)(res, 400, err.message, null, true);
    });
};
var createUserFromEmailAndPassword = function (req, res, email, password, firstName, lastName, emiratesId, role, referenceId, status) {
    if (status === void 0) { status = roles_1.UserStatus.APPROVED; }
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, user_1.default.find({ email: email }).exec().then(function (user) {
                        if (user.length > 0) {
                            return false;
                        }
                        // If email is valid
                        bcryptjs_1.default.hash(password, 10, function (hashError, hash) { return __awaiter(void 0, void 0, void 0, function () {
                            var _user;
                            return __generator(this, function (_a) {
                                if (hashError) {
                                    return [2 /*return*/, false];
                                }
                                _user = new user_1.default({
                                    _id: new mongoose_1.default.Types.ObjectId(),
                                    firstName: firstName,
                                    lastName: lastName,
                                    email: email,
                                    password: hash,
                                    role: role,
                                    emiratesId: emiratesId,
                                    referenceId: referenceId,
                                    status: status || roles_1.UserStatus.APPROVED
                                });
                                return [2 /*return*/, _user.save()];
                            });
                        }); });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var createPatientUserFromEmailAndPassword = function (req, res, email, password, firstName, lastName, phoneNo, emiratesId, role, referenceId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_1.default.find({ email: email }).exec().then(function (user) {
                    if (user.length > 0) {
                        return false;
                    }
                    // If email is valid
                    bcryptjs_1.default.hash(password, 10, function (hashError, hash) { return __awaiter(void 0, void 0, void 0, function () {
                        var _user;
                        return __generator(this, function (_a) {
                            if (hashError) {
                                return [2 /*return*/, false];
                            }
                            _user = new user_1.default({
                                _id: new mongoose_1.default.Types.ObjectId(),
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                phoneNo: phoneNo,
                                password: hash,
                                role: role,
                                emiratesId: emiratesId,
                                referenceId: referenceId
                            });
                            _user.save().then(function (createdUser) {
                                // @ts-ignore
                                (0, signJWT_1.default)(createdUser, function (_error, token) {
                                    if (_error) {
                                        logging_1.default.error(NAMESPACE, 'Unable to sign token: ', _error);
                                        return (0, makeResponse_1.sendErrorResponse)(res, 400, "Unauthorized", statusCode_1.UNAUTHORIZED_CODE);
                                    }
                                    else if (token) {
                                        return (0, makeResponse_1.default)(res, 200, "Patient registered successfully", { user: createdUser, token: token }, false);
                                    }
                                });
                            });
                            return [2 /*return*/];
                        });
                    }); });
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var deleteUserWithEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        user_1.default.deleteOne({ email: email }).then(function (user) {
            return true;
        }).catch(function (err) {
            return false;
        });
        return [2 /*return*/];
    });
}); };
var updateUser = function (req, res, id, user, isHospital) {
    if (isHospital === void 0) { isHospital = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var update, hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    update = isHospital ? __assign({}, user) : __assign({}, req.body);
                    if (!req.body.password) return [3 /*break*/, 2];
                    return [4 /*yield*/, bcryptjs_1.default.hash(user.password, 10)];
                case 1:
                    hash = _a.sent();
                    update = __assign(__assign({}, update), { password: hash });
                    return [3 /*break*/, 3];
                case 2:
                    delete update.password;
                    _a.label = 3;
                case 3:
                    user_1.default.findOneAndUpdate({ _id: id }, __assign({}, update)).then(function (updatedHospital) {
                        return true;
                    }).catch(function (err) {
                        return false;
                    });
                    return [2 /*return*/];
            }
        });
    });
};
var forgetPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, token, content, final_template, options, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, user_1.default.findOne({ email: email })];
            case 2:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
                token = jsonwebtoken_1.default.sign({ _id: user._id }, "medicapp_reset_password_key", { expiresIn: '20m' });
                content = fs_1.default.readFileSync(path_1.default.join(("".concat(__dirname, "/../templates/ResetPassword.html"))));
                final_template = content.toString().replace('[name]', (user === null || user === void 0 ? void 0 : user.firstName) + " " + (user === null || user === void 0 ? void 0 : user.lastName)).toString().replace('[link]', "https://www.medicappae.com/reset-password/".concat(token));
                options = {
                    from: "Medicappae <noreply@medicappae.com>",
                    replyTo: 'noreply@medicappae.com',
                    to: user === null || user === void 0 ? void 0 : user.email,
                    subject: "Reset Password",
                    // @ts-ignore,
                    html: final_template
                };
                (0, mailer_1.sendEmail)(options);
                // @ts-ignore
                return [4 /*yield*/, user_1.default.findOneAndUpdate({ _id: user._id }, { resetLink: token })];
            case 3:
                // @ts-ignore
                _a.sent();
                (0, mailer_1.sendEmail)(options);
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Reset password email has been sent", null, false)];
            case 4: return [2 /*return*/, (0, makeResponse_1.sendErrorResponse)(res, 400, "Email not present", statusCode_1.SERVER_ERROR_CODE)];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                // @ts-ignore
                return [2 /*return*/, (0, makeResponse_1.sendErrorResponse)(res, 400, err_1, statusCode_1.SERVER_ERROR_CODE)];
            case 7: return [2 /*return*/];
        }
    });
}); };
var getSingleUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user_1.default.find({ _id: id })];
            case 2:
                user = _a.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "User", user, false)];
            case 3:
                err_2 = _a.sent();
                return [2 /*return*/, (0, makeResponse_1.sendErrorResponse)(res, 400, "Error", statusCode_1.SERVER_ERROR_CODE)];
            case 4: return [2 /*return*/];
        }
    });
}); };
var resetPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, resetLink, newPass;
    return __generator(this, function (_b) {
        _a = req.body, resetLink = _a.resetLink, newPass = _a.newPass;
        if (resetLink) {
            jsonwebtoken_1.default.verify(resetLink, "medicapp_reset_password_key", function (error, decodedData) {
                var _this = this;
                if (error) {
                    return (0, makeResponse_1.sendErrorResponse)(res, 400, "Reset Password link has expired", statusCode_1.SERVER_ERROR_CODE);
                }
                user_1.default.findOne({ resetLink: resetLink }, function (err, user) {
                    if (err || !user) {
                        return (0, makeResponse_1.sendErrorResponse)(res, 400, "User with this token does not exists", statusCode_1.SERVER_ERROR_CODE);
                    }
                    try {
                        bcryptjs_1.default.hash(newPass, 10, function (hashError, hash) { return __awaiter(_this, void 0, void 0, function () {
                            var userFilter, update;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (hashError) {
                                            return [2 /*return*/, false];
                                        }
                                        userFilter = { resetLink: resetLink };
                                        update = {
                                            password: hash
                                        };
                                        return [4 /*yield*/, user_1.default.findOneAndUpdate(userFilter, update)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "User password reset successfully", user, false)];
                                }
                            });
                        }); });
                    }
                    catch (err) {
                        return (0, makeResponse_1.sendErrorResponse)(res, 400, "Problem while reseting password", statusCode_1.SERVER_ERROR_CODE);
                    }
                });
            });
        }
        else {
            return [2 /*return*/, (0, makeResponse_1.sendErrorResponse)(res, 400, "Reset Password link has expired", statusCode_1.SERVER_ERROR_CODE)];
        }
        return [2 /*return*/];
    });
}); };
exports.default = {
    validateToken: validateToken,
    login: login,
    register: register,
    getAllUsers: getAllUsers,
    deleteUser: deleteUser,
    createUserFromEmailAndPassword: createUserFromEmailAndPassword,
    createPatientUserFromEmailAndPassword: createPatientUserFromEmailAndPassword,
    deleteUserWithEmail: deleteUserWithEmail,
    updateUser: updateUser,
    resetPassword: resetPassword,
    getSingleUser: getSingleUser,
    forgetPassword: forgetPassword
};
