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
var uploadS3_1 = require("../../functions/uploadS3");
var NAMESPACE = "Promos";
var createPromo = function (req, res, next) {
    (0, uploadS3_1.uploadsOnlyVideo)(req, res, function (error) { return __awaiter(void 0, void 0, void 0, function () {
        var newPromo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!error) return [3 /*break*/, 1];
                    return [2 /*return*/, (0, makeResponse_1.default)(res, 400, "Error in uploading Promo Video to S3 Bucket", null, true)];
                case 1:
                    if (!(req.file === undefined)) return [3 /*break*/, 2];
                    return [2 /*return*/, (0, makeResponse_1.default)(res, 400, "No File Selected", null, true)];
                case 2:
                    newPromo = new promo_1.default({
                        // @ts-ignore
                        url: req.file.location,
                        // @ts-ignore
                        name: req.file.originalname,
                        // @ts-ignore
                        key: req.file.key,
                        hospitalId: res.locals.jwt.reference_id
                    });
                    return [4 /*yield*/, newPromo.save()
                            .then(function (video) {
                            return (0, makeResponse_1.default)(res, 201, "Promo video uploaded successfully", video, false);
                        })
                            .catch(function (err) {
                            res.status(400).json({
                                statusCode: 400,
                                message: "Update Failed",
                                errors: err,
                            });
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); });
};
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
exports.default = {
    createPromo: createPromo,
    getAllPromos: getAllPromos,
    deletePromo: deletePromo
};
