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
var makeResponse_1 = __importDefault(require("../../functions/makeResponse"));
var package_1 = __importDefault(require("../../models/vendors/package"));
var cloudinary_1 = __importDefault(require("cloudinary"));
var config_1 = __importDefault(require("../../config/config"));
var NAMESPACE = "Package";
var createPackage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, points, buyQuantity, getQuantity, off, vendorId, category_id, about, termsAndConditions, result, newPackage, packge, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, type = _a.type, points = _a.points, buyQuantity = _a.buyQuantity, getQuantity = _a.getQuantity, off = _a.off, vendorId = _a.vendorId, category_id = _a.category_id, about = _a.about, termsAndConditions = _a.termsAndConditions;
                // @ts-ignore
                cloudinary_1.default.v2.config({
                    cloud_name: config_1.default.cloudinary.name,
                    api_key: config_1.default.cloudinary.apiKey,
                    api_secret: config_1.default.cloudinary.secretKey
                });
                return [4 /*yield*/, cloudinary_1.default.uploader.upload(req.file.path)];
            case 1:
                result = _b.sent();
                newPackage = { images: [result.url], type: type, points: points, buyQuantity: buyQuantity, getQuantity: getQuantity, off: off, vendorId: vendorId, category_id: category_id, about: about, termsAndConditions: termsAndConditions };
                return [4 /*yield*/, new package_1.default(newPackage).save().then(function (t) { return t.populate('vendorId').populate('category_id').execPopulate(); })];
            case 2:
                packge = _b.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Package Created Successfully", packge, false)];
            case 3:
                err_1 = _b.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 400, err_1.message, null, true)];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getAllPackages = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        package_1.default.find({}).populate("packageId").populate("patientId").populate("vendorId").populate("category_id")
            .then(function (result) {
            return (0, makeResponse_1.default)(res, 200, "All Packages", result, false);
        })
            .catch(function (err) {
            return (0, makeResponse_1.default)(res, 400, err.message, null, true);
        });
        return [2 /*return*/];
    });
}); };
var updatePackage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, update, filter, result, newPackage, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                update = JSON.parse(JSON.stringify(__assign({}, req.body)));
                filter = { _id: id };
                if (!((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path)) return [3 /*break*/, 3];
                // @ts-ignore
                cloudinary_1.default.v2.config({
                    cloud_name: config_1.default.cloudinary.name,
                    api_key: config_1.default.cloudinary.apiKey,
                    api_secret: config_1.default.cloudinary.secretKey
                });
                return [4 /*yield*/, cloudinary_1.default.uploader.upload(req.file.path)];
            case 2:
                result = _b.sent();
                update = __assign(__assign({}, update), { images: [result.url] });
                _b.label = 3;
            case 3: return [4 /*yield*/, package_1.default.findOneAndUpdate(filter, update)];
            case 4:
                _b.sent();
                return [4 /*yield*/, package_1.default.findById({ _id: id }).populate("packageId").populate("patientId").populate("vendorId").populate("category_id")];
            case 5:
                newPackage = _b.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Package updated Successfully", newPackage, false)];
            case 6:
                err_2 = _b.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 400, err_2.message, null, true)];
            case 7: return [2 /*return*/];
        }
    });
}); };
var deletePackage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, deletedPackage, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, package_1.default.findByIdAndDelete(_id)];
            case 2:
                deletedPackage = _a.sent();
                if (!deletedPackage)
                    return [2 /*return*/, res.sendStatus(404)];
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Deleted Successfully", deletedPackage, false)];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getSinglePackage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, result, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, package_1.default.findById({ _id: _id }).populate("packageId").populate("patientId").populate("vendorId").populate("category_id")];
            case 2:
                result = _a.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Single Package", result, false)];
            case 3:
                e_2 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getVendorPackages = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vendorId, result, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vendorId = req.params.vendorId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, package_1.default.find({ vendorId: vendorId }).populate("packageId").populate("patientId").populate("vendorId").populate("category_id")];
            case 2:
                result = _a.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Vendor Packages", result, false)];
            case 3:
                e_3 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.default = {
    createPackage: createPackage,
    getAllPackages: getAllPackages,
    deletePackage: deletePackage,
    updatePackage: updatePackage,
    getSinglePackage: getSinglePackage,
    getVendorPackages: getVendorPackages
};
