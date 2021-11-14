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
var logging_1 = __importDefault(require("../config/logging"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var mongoose_1 = __importDefault(require("mongoose"));
var user_1 = __importDefault(require("../models/user"));
var signJWT_1 = __importDefault(require("../functions/signJWT"));
var makeResponse_1 = __importStar(require("../functions/makeResponse"));
var login_1 = __importDefault(require("../validation/login"));
var statusCode_1 = require("../constants/statusCode");
var NAMESPACE = "User";
var validateToken = function (req, res, next) {
    logging_1.default.info(NAMESPACE, "Token validated, user authenticated");
    return res.status(200).json({
        message: "Authorized"
    });
};
var register = function (req, res, next) {
    // // Form validation
    // const { errors, isValid } = validateRegisterInput(req.body);
    // // Check validation
    // if (!isValid) {
    //     return makeResponse(res, 400, "Validation Failed", errors, true);
    // }
    var _a = req.body, email = _a.email, password = _a.password;
    user_1.default.find({ email: email }).exec().then(function (user) {
        if (user.length > 0) {
            return makeResponse_1.default(res, 400, "Email already exists", null, true);
        }
        // If email is valid
        bcryptjs_1.default.hash(password, 10, function (hashError, hash) {
            if (hashError) {
                return makeResponse_1.default(res, 400, hashError.message, null, true);
            }
            var _user = new user_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                email: email,
                password: hash
            });
            return _user.save().then(function (user) {
                return makeResponse_1.default(res, 201, "User Registered Successfully", user, false);
            }).catch(function (error) {
                return makeResponse_1.default(res, 400, error.message, null, true);
            });
        });
    });
};
var login = function (req, res, next) {
    // Form validation
    var _a = login_1.default(req.body), errors = _a.errors, isValid = _a.isValid;
    // Check validation
    if (!isValid) {
        // @ts-ignore
        return makeResponse_1.sendErrorResponse(res, 400, Object.values(errors)[0], Object.values(errors)[0].includes("invalid") ? statusCode_1.INVALID_VALUE_CODE : statusCode_1.PARAMETER_MISSING_CODE);
    }
    var _b = req.body, email = _b.email, password = _b.password;
    user_1.default.find({ email: email })
        .exec()
        .then(function (users) {
        if (users.length !== 1) {
            return makeResponse_1.sendErrorResponse(res, 400, "Unauthorized", statusCode_1.UNAUTHORIZED_CODE);
        }
        bcryptjs_1.default.compare(password, users[0].password, function (error, result) {
            if (!result) {
                return makeResponse_1.sendErrorResponse(res, 400, "Unauthorized", statusCode_1.UNAUTHORIZED_CODE);
            }
            else if (result) {
                signJWT_1.default(users[0], function (_error, token) {
                    if (_error) {
                        logging_1.default.error(NAMESPACE, 'Unable to sign token: ', _error);
                        return makeResponse_1.sendErrorResponse(res, 400, "Unauthorized", statusCode_1.UNAUTHORIZED_CODE);
                    }
                    else if (token) {
                        return makeResponse_1.default(res, 200, "Authentication Successful", { user: users[0], token: token }, false);
                    }
                });
            }
        });
    }).catch(function (error) {
        return makeResponse_1.default(res, 400, error.message, null, true);
    });
};
var getAllUsers = function (req, res, next) {
    user_1.default.find().select("-password").exec()
        .then(function (users) {
        return makeResponse_1.default(res, 200, "Users List", users, false);
    })
        .catch(function (error) {
        return makeResponse_1.default(res, 400, error.message, null, true);
    });
};
var deleteUser = function (req, res, next) {
    user_1.default.deleteOne({ _id: req.params.id }).then(function (user) {
        return makeResponse_1.default(res, 200, "User Deleted Successfully", null, false);
    }).catch(function (err) {
        return makeResponse_1.default(res, 400, err.message, null, true);
    });
};
var createUserFromEmailAndPassword = function (req, res, email, password, firstName, lastName, role, referenceId) { return __awaiter(void 0, void 0, void 0, function () {
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
                            switch (_a.label) {
                                case 0:
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
                                        referenceId: referenceId
                                    });
                                    return [4 /*yield*/, _user.save()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
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
var updateUser = function (req, res, id, user) { return __awaiter(void 0, void 0, void 0, function () {
    var update, hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                update = __assign({}, req.body);
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
}); };
exports.default = {
    validateToken: validateToken,
    login: login,
    register: register,
    getAllUsers: getAllUsers,
    deleteUser: deleteUser,
    createUserFromEmailAndPassword: createUserFromEmailAndPassword,
    deleteUserWithEmail: deleteUserWithEmail,
    updateUser: updateUser
};
