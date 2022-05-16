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
var makeResponse_1 = __importStar(require("../functions/makeResponse"));
var bookmark_1 = __importDefault(require("../models/bookmark"));
var roles_1 = require("../constants/roles");
var statusCode_1 = require("../constants/statusCode");
var hospital_1 = __importDefault(require("../models/hospital/hospital"));
var doctor_1 = __importDefault(require("../models/doctors/doctor"));
var createBookmark = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, id, bookmarks, update, bookmark;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, type = _a.type, id = _a.id;
                return [4 /*yield*/, bookmark_1.default.find({ user: res.locals.jwt._id })];
            case 1:
                bookmarks = _b.sent();
                if (bookmarks) {
                    update = type === roles_1.Roles.DOCTOR ? { doctorIds: id } : { hospitalIds: id };
                    bookmark_1.default.findOneAndUpdate({ user: res.locals.jwt._id }, { $push: update }, { upsert: true }).then(function (result) {
                        return (0, makeResponse_1.default)(res, 201, "Bookmark Saved Successfully", result, false);
                    }).catch(function (err) {
                        return (0, makeResponse_1.sendErrorResponse)(res, 400, err.message, statusCode_1.SERVER_ERROR_CODE);
                    });
                }
                else {
                    bookmark = new bookmark_1.default({
                        user: res.locals.jwt._id,
                        hospitalIds: type === roles_1.Roles.HOSPITAL ? [id] : [],
                        doctorIds: type === roles_1.Roles.DOCTOR ? [id] : []
                    });
                    bookmark.save().then(function (result) {
                        return (0, makeResponse_1.default)(res, 201, "Bookmark Saved Successfully", result, false);
                    }).catch(function (err) {
                        return (0, makeResponse_1.sendErrorResponse)(res, 400, err.message, statusCode_1.SERVER_ERROR_CODE);
                    });
                }
                return [2 /*return*/];
        }
    });
}); };
var deleteBookmark = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, id, update;
    return __generator(this, function (_b) {
        _a = req.body, type = _a.type, id = _a.id;
        update = type === roles_1.Roles.DOCTOR ? { doctorIds: id } : { hospitalIds: id };
        console.log("Update => ", update);
        bookmark_1.default.findOneAndUpdate({ user: res.locals.jwt._id }, { $pull: update }, { upsert: true }).then(function (result) {
            return (0, makeResponse_1.default)(res, 201, "Bookmark Deleted Successfully", result, false);
        }).catch(function (err) {
            return (0, makeResponse_1.sendErrorResponse)(res, 400, err.message, statusCode_1.SERVER_ERROR_CODE);
        });
        return [2 /*return*/];
    });
}); };
var getBookmarks = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bookmarks, hospitals, doctors, err_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                return [4 /*yield*/, bookmark_1.default.find({ user: res.locals.jwt._id })];
            case 1:
                bookmarks = _c.sent();
                hospitals = [];
                doctors = [];
                if (!((bookmarks === null || bookmarks === void 0 ? void 0 : bookmarks.length) > 0 && ((_a = bookmarks[0]) === null || _a === void 0 ? void 0 : _a.hospitalIds.length) > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, hospital_1.default.find({
                        '_id': { $in: bookmarks[0].hospitalIds }
                    })];
            case 2:
                hospitals = _c.sent();
                _c.label = 3;
            case 3:
                if (!((bookmarks === null || bookmarks === void 0 ? void 0 : bookmarks.length) > 0 && ((_b = bookmarks[0]) === null || _b === void 0 ? void 0 : _b.doctorIds.length) > 0)) return [3 /*break*/, 5];
                return [4 /*yield*/, doctor_1.default.find({
                        '_id': { $in: bookmarks[0].doctorIds }
                    }).populate("specialityId").populate("hospitalId")];
            case 4:
                doctors = _c.sent();
                _c.label = 5;
            case 5: return [2 /*return*/, (0, makeResponse_1.default)(res, 201, "All Bookmarks", { hospitals: hospitals, doctors: doctors }, false)];
            case 6:
                err_1 = _c.sent();
                // @ts-ignore
                return [2 /*return*/, (0, makeResponse_1.sendErrorResponse)(res, 400, err_1.message, statusCode_1.SERVER_ERROR_CODE)];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.default = {
    createBookmark: createBookmark,
    deleteBookmark: deleteBookmark,
    getBookmarks: getBookmarks
};
