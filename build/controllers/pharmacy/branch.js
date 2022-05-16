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
var branch_1 = __importDefault(require("../../models/pharmacy/branch"));
var makeResponse_1 = __importDefault(require("../../functions/makeResponse"));
var NAMESPACE = "Branch";
var createBranch = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, location, mobile, about, pharmacyId, newBranch;
    return __generator(this, function (_b) {
        _a = req.body, location = _a.location, mobile = _a.mobile, about = _a.about, pharmacyId = _a.pharmacyId;
        if (location && mobile && about && pharmacyId) {
            newBranch = new branch_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                location: location,
                mobile: mobile,
                about: about,
                pharmacyId: pharmacyId
            });
            return [2 /*return*/, newBranch.save()
                    .then(function (result) {
                    return (0, makeResponse_1.default)(res, 201, "Branch Created Successfully", result, false);
                })
                    .catch(function (err) {
                    return (0, makeResponse_1.default)(res, 400, err.message, null, true);
                })];
        }
        else {
            return [2 /*return*/, (0, makeResponse_1.default)(res, 400, "Validation Failed", null, true)];
        }
        return [2 /*return*/];
    });
}); };
var getAllBranchesOfPharmacy = function (req, res, next) {
    branch_1.default.find({ pharmacyId: req.params.pharmacyId })
        .then(function (result) {
        return (0, makeResponse_1.default)(res, 200, "All Branches", result, false);
    })
        .catch(function (err) {
        return (0, makeResponse_1.default)(res, 400, err.message, null, true);
    });
};
var getSingleBranch = function (req, res, next) {
    branch_1.default.findById({ _id: req.params.branchId })
        .then(function (data) {
        return (0, makeResponse_1.default)(res, 200, "Branch", data, false);
    }).catch(function (err) {
        return (0, makeResponse_1.default)(res, 400, err.message, null, true);
    });
};
var updateBranch = function (req, res, next) {
    var id = req.params.id;
    var filter = { _id: id };
    var update = __assign({}, req.body);
    branch_1.default.findOneAndUpdate(filter, update).then(function (updatedBranch) {
        return (0, makeResponse_1.default)(res, 200, "Branch updated Successfully", updatedBranch, false);
    }).catch(function (err) {
        return (0, makeResponse_1.default)(res, 400, err.message, null, true);
    });
};
var deleteBranch = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, branch, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, branch_1.default.findByIdAndDelete(_id)];
            case 2:
                branch = _a.sent();
                if (!branch)
                    return [2 /*return*/, res.sendStatus(404)];
                return [2 /*return*/, (0, makeResponse_1.default)(res, 200, "Deleted Successfully", branch, false)];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, res.sendStatus(400)];
            case 4: return [2 /*return*/];
        }
    });
}); };
var searchBranch = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var searchedText, searchedTextRegex, searchQuery;
    return __generator(this, function (_a) {
        searchedText = req.params.searchedText;
        searchedTextRegex = new RegExp(searchedText, 'i');
        searchQuery = [
            { mobile: searchedTextRegex },
            { location: searchedTextRegex },
            { about: searchedTextRegex }
        ];
        branch_1.default.find({ $or: searchQuery }).then(function (result) {
            return (0, makeResponse_1.default)(res, 200, "Search Results", result, false);
        }).catch(function (err) {
            return (0, makeResponse_1.default)(res, 400, "Error while searching Branch", null, true);
        });
        return [2 /*return*/];
    });
}); };
exports.default = {
    createBranch: createBranch,
    getAllBranchesOfPharmacy: getAllBranchesOfPharmacy,
    getSingleBranch: getSingleBranch,
    updateBranch: updateBranch,
    deleteBranch: deleteBranch,
    searchBranch: searchBranch
};
