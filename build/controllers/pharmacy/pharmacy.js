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
var pharmacy_1 = __importDefault(require("../../models/pharmacy/pharmacy"));
var user_1 = __importDefault(require("../../models/user"));
var makeResponse_1 = __importDefault(require("../../functions/makeResponse"));
var user_2 = __importDefault(require("../user"));
var roles_1 = require("../../constants/roles");
var NAMESPACE = "Hospital";
var createPharmacy = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, name, tradeLicenseNo, issueDate, expiryDate, noOfBranches;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, name = _a.name, tradeLicenseNo = _a.tradeLicenseNo, issueDate = _a.issueDate, expiryDate = _a.expiryDate, noOfBranches = _a.noOfBranches;
                return [4 /*yield*/, user_1.default.find({ email: email }).then(function (result) {
                        if (result.length === 0) {
                            if (email && password && name && tradeLicenseNo && issueDate && expiryDate && noOfBranches) {
                                var newPharmacy = new pharmacy_1.default({
                                    _id: new mongoose_1.default.Types.ObjectId(),
                                    email: email,
                                    name: name,
                                    tradeLicenseNo: tradeLicenseNo,
                                    issueDate: issueDate,
                                    expiryDate: expiryDate,
                                    noOfBranches: noOfBranches,
                                    // tradeLicenseFile: config.server.APP_URL + "/" + (( req && req.file && req.file.filename ) ? req.file.filename : "")
                                });
                                return newPharmacy.save()
                                    .then(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, user_2.default.createUserFromEmailAndPassword(req, res, email, password, name, "", "", roles_1.Roles.PHARMACY, result._id)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/, (0, makeResponse_1.default)(res, 201, "Pharmacy Created Successfully", result, false)];
                                        }
                                    });
                                }); })
                                    .catch(function (err) {
                                    return (0, makeResponse_1.default)(res, 400, err.message, null, true);
                                });
                            }
                            else {
                                return (0, makeResponse_1.default)(res, 400, "Validation Failed", null, true);
                            }
                        }
                        else {
                            return (0, makeResponse_1.default)(res, 400, "Email already exists", null, true);
                        }
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
var getAllPharmacies = function (req, res, next) {
    pharmacy_1.default.find({})
        .then(function (result) {
        return (0, makeResponse_1.default)(res, 200, "All Pharmacies", result, false);
    })
        .catch(function (err) {
        return (0, makeResponse_1.default)(res, 400, err.message, null, true);
    });
};
var getSinglePharmacy = function (req, res, next) {
    pharmacy_1.default.findById({ _id: req.params.id })
        .then(function (data) {
        return (0, makeResponse_1.default)(res, 200, "Pharmacy", data, false);
    }).catch(function (err) {
        return (0, makeResponse_1.default)(res, 400, err.message, null, true);
    });
};
var updatePharmacy = function (req, res, next) {
    var id = req.params.id;
    var filter = { _id: id };
    var update = __assign({}, req.body);
    pharmacy_1.default.findOneAndUpdate(filter, update).then(function (updatedPharmacy) {
        return (0, makeResponse_1.default)(res, 200, "Pharmacy updated Successfully", updatedPharmacy, false);
    }).catch(function (err) {
        return (0, makeResponse_1.default)(res, 400, err.message, null, true);
    });
};
var deletePharmacy = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, pharmacy, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, pharmacy_1.default.findByIdAndDelete(_id)];
            case 2:
                pharmacy = _a.sent();
                if (!pharmacy)
                    return [2 /*return*/, res.sendStatus(404)];
                return [4 /*yield*/, user_2.default.deleteUserWithEmail(pharmacy.email)];
            case 3:
                _a.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Deleted Successfully", pharmacy, false)];
            case 4:
                e_1 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 5: return [2 /*return*/];
        }
    });
}); };
var searchPharmacy = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var searchedText, searchedTextRegex, searchQuery;
    return __generator(this, function (_a) {
        searchedText = req.params.searchedText;
        searchedTextRegex = new RegExp(searchedText, 'i');
        searchQuery = [
            { name: searchedTextRegex },
            { email: searchedTextRegex },
            { tradeLicenseNo: searchedTextRegex }
        ];
        pharmacy_1.default.find({ $or: searchQuery }).then(function (result) {
            return (0, makeResponse_1.default)(res, 200, "Search Results", result, false);
        }).catch(function (err) {
            return (0, makeResponse_1.default)(res, 400, "Error while searching Pharmacy", null, true);
        });
        return [2 /*return*/];
    });
}); };
exports.default = {
    createPharmacy: createPharmacy,
    getAllPharmacies: getAllPharmacies,
    getSinglePharmacy: getSinglePharmacy,
    updatePharmacy: updatePharmacy,
    deletePharmacy: deletePharmacy,
    searchPharmacy: searchPharmacy
};
