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
var packageCategory_1 = __importDefault(require("../../models/vendors/packageCategory"));
var makeResponse_1 = __importDefault(require("../../functions/makeResponse"));
var cloudinary_1 = __importDefault(require("cloudinary"));
var config_1 = __importDefault(require("../../config/config"));
var package_1 = __importDefault(require("../../models/vendors/package"));
var NAMESPACE = "PackageCategory";
var createPackageCategory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_en, name_ar, result, newPackageCategory;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name_en = _a.name_en, name_ar = _a.name_ar;
                // @ts-ignore
                cloudinary_1.default.v2.config({
                    cloud_name: config_1.default.cloudinary.name,
                    api_key: config_1.default.cloudinary.apiKey,
                    api_secret: config_1.default.cloudinary.secretKey
                });
                return [4 /*yield*/, cloudinary_1.default.uploader.upload(req.file.path)];
            case 1:
                result = _b.sent();
                newPackageCategory = new packageCategory_1.default({ name_en: name_en, name_ar: name_ar, image: result.url });
                newPackageCategory.save().then(function (result) {
                    return (0, makeResponse_1.default)(res, 201, "Package Category Created Successfully", result, false);
                })
                    .catch(function (err) {
                    return (0, makeResponse_1.default)(res, 400, err.message, null, true);
                });
                return [2 /*return*/];
        }
    });
}); };
var getAllPackageCategories = function (req, res, next) {
    packageCategory_1.default.find({})
        .then(function (result) {
        return (0, makeResponse_1.default)(res, 200, "All Package Category", result, false);
    })
        .catch(function (err) {
        return (0, makeResponse_1.default)(res, 400, err.message, null, true);
    });
};
var getSinglePackageCategory = function (req, res, next) {
    packageCategory_1.default.findById({ _id: req.params.id })
        .then(function (data) {
        return (0, makeResponse_1.default)(res, 200, "Package Category", data, false);
    }).catch(function (err) {
        return (0, makeResponse_1.default)(res, 400, err.message, null, true);
    });
};
var updatePackageCategory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, filter, update, result, newCategories, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                filter = { _id: id };
                update = { name_en: req.body.name_en, name_ar: req.body.name_ar };
                if (!req.file.path) return [3 /*break*/, 3];
                // @ts-ignore
                cloudinary_1.default.v2.config({
                    cloud_name: config_1.default.cloudinary.name,
                    api_key: config_1.default.cloudinary.apiKey,
                    api_secret: config_1.default.cloudinary.secretKey
                });
                return [4 /*yield*/, cloudinary_1.default.uploader.upload(req.file.path)
                    // @ts-ignore
                ];
            case 2:
                result = _a.sent();
                // @ts-ignore
                update = __assign(__assign({}, update), { image: result.url });
                _a.label = 3;
            case 3: return [4 /*yield*/, packageCategory_1.default.findOneAndUpdate(filter, update)];
            case 4:
                _a.sent();
                return [4 /*yield*/, packageCategory_1.default.find({})];
            case 5:
                newCategories = _a.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Vendor Type Updated", newCategories, false)];
            case 6:
                err_1 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 7: return [2 /*return*/];
        }
    });
}); };
var deletePackageCategory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, packageCategory, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, packageCategory_1.default.findByIdAndDelete(_id)];
            case 2:
                packageCategory = _a.sent();
                if (!packageCategory)
                    return [2 /*return*/, res.sendStatus(404)];
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Deleted Successfully", packageCategory, false)];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getPackageCategoryOffers = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryId, packages, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                categoryId = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, package_1.default.find({ category_id: categoryId }).populate("vendorId").populate("category_id")];
            case 2:
                packages = _a.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Offers on this package", packages, false)];
            case 3:
                e_2 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.default = {
    createPackageCategory: createPackageCategory,
    getAllPackageCategories: getAllPackageCategories,
    getSinglePackageCategory: getSinglePackageCategory,
    updatePackageCategory: updatePackageCategory,
    deletePackageCategory: deletePackageCategory,
    getPackageCategoryOffers: getPackageCategoryOffers
};
