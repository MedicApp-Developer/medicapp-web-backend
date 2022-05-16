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
var promo_1 = __importDefault(require("../../models/hospital/promo"));
var makeResponse_1 = __importDefault(require("../../functions/makeResponse"));
var pagination_1 = require("../../constants/pagination");
var config_1 = __importDefault(require("../../config/config"));
var cloudinary_1 = __importDefault(require("cloudinary"));
var patient_1 = __importDefault(require("../../models/patient"));
var NAMESPACE = "Promos";
var createPromo = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var result, newPromo, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // @ts-ignore
                cloudinary_1.default.v2.config({
                    cloud_name: config_1.default.cloudinary.name,
                    api_key: config_1.default.cloudinary.apiKey,
                    api_secret: config_1.default.cloudinary.secretKey
                });
                return [4 /*yield*/, cloudinary_1.default.v2.uploader.upload(req.file.path, {
                        resource_type: "video",
                        public_id: "sample_id",
                        chunk_size: 6000000,
                        eager: [
                            { width: 300, height: 300, crop: "pad", audio_codec: "none" },
                            { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }
                        ],
                        eager_async: true,
                    })];
            case 1:
                result = _a.sent();
                newPromo = new promo_1.default({
                    // @ts-ignore
                    url: result.url,
                    // @ts-ignore
                    name: req.file.originalname,
                    hospitalId: res.locals.jwt.reference_id
                });
                newPromo.save()
                    .then(function (video) {
                    return (0, makeResponse_1.default)(res, 201, "Promo video uploaded successfully", video, false);
                })
                    .catch(function (err) {
                    res.status(400).json({
                        statusCode: 400,
                        message: "Update Failed",
                        errors: err,
                    });
                });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                res.status(400).json({
                    statusCode: 400,
                    message: "Update Failed",
                    errors: err_1,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getAllPromos = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var page, total;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                page = parseInt(req.query.page || "0");
                return [4 /*yield*/, promo_1.default.find({ hospitalId: res.locals.jwt.reference_id }).countDocuments({})];
            case 1:
                total = _a.sent();
                promo_1.default.find({ hospitalId: res.locals.jwt.reference_id }).limit(pagination_1.Pagination.PAGE_SIZE).skip(pagination_1.Pagination.PAGE_SIZE * page)
                    .then(function (result) {
                    return (0, makeResponse_1.default)(res, 200, "All Promo Videos", { totalItems: total, totalPages: Math.ceil(total / pagination_1.Pagination.PAGE_SIZE), videos: result }, false);
                })
                    .catch(function (err) {
                    return (0, makeResponse_1.default)(res, 400, err.message, null, true);
                });
                return [2 /*return*/];
        }
    });
}); };
var getAllPromoVideos = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var getAll, page, limit_1, total_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getAll = req.query.getAll;
                if (!getAll) return [3 /*break*/, 1];
                promo_1.default.find({})
                    .populate({
                    path: 'hospitalId',
                    populate: [
                        { path: 'category' },
                        { path: 'services' }
                    ]
                })
                    .then(function (result) {
                    return (0, makeResponse_1.default)(res, 200, "All Promo Videos", result, false);
                })
                    .catch(function (err) {
                    return (0, makeResponse_1.default)(res, 400, err.message, null, true);
                });
                return [3 /*break*/, 3];
            case 1:
                page = parseInt(req.query.page || "0");
                limit_1 = parseInt(req.query.limit || "4");
                return [4 /*yield*/, promo_1.default.find({}).countDocuments({})];
            case 2:
                total_1 = _a.sent();
                promo_1.default.find({})
                    .populate({
                    path: 'hospitalId',
                    populate: [
                        { path: 'category' },
                        { path: 'services' }
                    ]
                })
                    .limit(pagination_1.Pagination.PAGE_SIZE).skip(limit_1 * page)
                    .then(function (result) {
                    return (0, makeResponse_1.default)(res, 200, "All Promo Videos", { totalItems: total_1, totalPages: Math.ceil(total_1 / limit_1), videos: result }, false);
                })
                    .catch(function (err) {
                    return (0, makeResponse_1.default)(res, 400, err.message, null, true);
                });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var deletePromo = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, promos, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, promo_1.default.findByIdAndDelete(_id)];
            case 2:
                promos = _a.sent();
                if (!promos)
                    return [2 /*return*/, res.sendStatus(404)];
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Deleted Successfully", promos, false)];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 4: return [2 /*return*/];
        }
    });
}); };
var likePromo = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, patientId, result, filter, update, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = req.params.promoId;
                patientId = req.params.patientId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, promo_1.default.findOneAndUpdate({ _id: _id }, { $inc: { likes: +1 } }, { new: true })];
            case 2:
                result = _a.sent();
                filter = { _id: patientId };
                update = { $push: { likedPromos: [_id] } };
                return [4 /*yield*/, patient_1.default.findOneAndUpdate(filter, update)];
            case 3:
                _a.sent();
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Promo Liked Successfully", result, false)];
            case 4:
                e_2 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.default = {
    createPromo: createPromo,
    getAllPromos: getAllPromos,
    deletePromo: deletePromo,
    getAllPromoVideos: getAllPromoVideos,
    likePromo: likePromo
};
