"use strict";
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
var mongoose_1 = __importDefault(require("mongoose"));
var patient_1 = __importDefault(require("../models/patient"));
var makeResponse_1 = __importStar(require("../functions/makeResponse"));
var rewards_1 = __importDefault(require("../models/rewards"));
var rewards_2 = require("../constants/rewards");
var package_1 = __importDefault(require("../models/vendors/package"));
var config_1 = __importDefault(require("../config/config"));
var mailer_1 = require("../functions/mailer");
var packageCategory_1 = __importDefault(require("../models/vendors/packageCategory"));
var NAMESPACE = "Rewards";
var subscribePackage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, packageId, patientId, vendorId, code, newReward, packge, savedReward, patient, options, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, packageId = _a.packageId, patientId = _a.patientId, vendorId = _a.vendorId;
                code = Math.floor(Math.random() * 10000000) + 1;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                newReward = new rewards_1.default({
                    _id: new mongoose_1.default.Types.ObjectId(),
                    code: code,
                    packageId: packageId,
                    patientId: patientId,
                    vendorId: vendorId
                });
                // Update Subscribed Count
                return [4 /*yield*/, package_1.default.findOneAndUpdate({ _id: packageId }, { $inc: { subscribedCount: +1 } })];
            case 2:
                // Update Subscribed Count
                _b.sent();
                return [4 /*yield*/, package_1.default.findById({ _id: packageId }).populate("packageId").populate("patientId").populate("vendorId")];
            case 3:
                packge = _b.sent();
                return [4 /*yield*/, newReward.save()];
            case 4:
                savedReward = _b.sent();
                return [4 /*yield*/, patient_1.default.findOneAndUpdate({ _id: patientId }, { $inc: { points: -packge.points } }, { new: true })];
            case 5:
                patient = _b.sent();
                options = {
                    from: config_1.default.mailer.user,
                    // @ts-ignore
                    to: patient.email,
                    subject: "Package Subscription",
                    // @ts-ignore
                    text: "You have successfully subscribed to ".concat(packge.type === "ON_PERCENTAGE" ? packge.off + " % " + " off " : "BUY " + (packge === null || packge === void 0 ? void 0 : packge.buyQuantity) + " GET " + (packge === null || packge === void 0 ? void 0 : packge.getQuantity), " by ").concat(packge.vendorId.firstName + " " + packge.vendorId.lastName, " for ").concat(packge === null || packge === void 0 ? void 0 : packge.points)
                };
                (0, mailer_1.sendEmail)(options);
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Reward registered successfully", { reward: savedReward }, false)];
            case 6:
                err_1 = _b.sent();
                // @ts-ignore
                return [2 /*return*/, (0, makeResponse_1.sendErrorResponse)(res, 400, err_1.message, SERVER_ERROR_CODE)];
            case 7: return [2 /*return*/];
        }
    });
}); };
var approvePackage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, update, filter, reward, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                update = { status: rewards_2.RewardStatus.TAKEN };
                filter = { _id: id };
                return [4 /*yield*/, rewards_1.default.findOneAndUpdate(filter, update).populate("packageId").populate("patientId").populate("vendorId")];
            case 2:
                reward = _a.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Package approved", reward, false)];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getAllPatientRewards = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var patientId, rewards, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                patientId = req.params.patientId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, rewards_1.default.find({ patientId: patientId, status: rewards_2.RewardStatus.PENDING }).populate("packageId").populate("patientId").populate("vendorId")];
            case 2:
                rewards = _a.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Patient Subscribed Packages", rewards, false)];
            case 3:
                e_2 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getAllVendorRewards = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vendorId, rewards, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vendorId = req.params.vendorId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, rewards_1.default.find({ vendorId: vendorId }).populate("packageId").populate("patientId").populate("vendorId")];
            case 2:
                rewards = _a.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Vendor Promo Codes", rewards, false)];
            case 3:
                e_3 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getPatientRewardsHomeData = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var packageCategories, popularPackages, recommendedPackages, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, packageCategory_1.default.find({})];
            case 1:
                packageCategories = _a.sent();
                return [4 /*yield*/, package_1.default.find({ "subscribedCount": { $gt: 0 } }).sort('-subscribedCount').populate("packageId").populate("patientId").populate("vendorId").populate("category_id")];
            case 2:
                popularPackages = _a.sent();
                return [4 /*yield*/, package_1.default.find({ "subscribedCount": { $lt: 1 } }).sort("-off").populate("packageId").populate("patientId").populate("vendorId").populate("category_id")];
            case 3:
                recommendedPackages = _a.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Rewards Home Data", { categories: packageCategories, popular: popularPackages, recommended: recommendedPackages }, false)];
            case 4:
                e_4 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.default = {
    subscribePackage: subscribePackage,
    approvePackage: approvePackage,
    getAllPatientRewards: getAllPatientRewards,
    getAllVendorRewards: getAllVendorRewards,
    getPatientRewardsHomeData: getPatientRewardsHomeData
};
