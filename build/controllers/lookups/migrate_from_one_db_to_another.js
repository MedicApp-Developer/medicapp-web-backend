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
var category_1 = __importDefault(require("../../models/category"));
var mongoose_1 = __importDefault(require("mongoose"));
var services_1 = __importDefault(require("../../models/hospital/services"));
var speciality_1 = __importDefault(require("../../models/doctors/speciality"));
var doctor_1 = __importDefault(require("../../models/doctors/doctor"));
var family_1 = __importDefault(require("../../models/family"));
var hospital_1 = __importDefault(require("../../models/hospital/hospital"));
var packageCategory_1 = __importDefault(require("../../models/vendors/packageCategory"));
var package_1 = __importDefault(require("../../models/vendors/package"));
var patient_1 = __importDefault(require("../../models/patient"));
var pointsCode_1 = __importDefault(require("../../models/pointsCode"));
var slot_1 = __importDefault(require("../../models/doctors/slot"));
var user_1 = __importDefault(require("../../models/user"));
var vendor_1 = __importDefault(require("../../models/vendors/vendor"));
var MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false,
    useFindAndModify: false, useCreateIndex: true
};
var MONGO_DB_1 = {
    host: "mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/Cluster0?retryWrites=true&w=majority",
    username: "superuser",
    password: "supersecretpasswords",
    options: MONGO_OPTIONS,
    url: "mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/Cluster0?retryWrites=true&w=majority"
};
var MONGO_DB_2 = {
    host: "mongodb+srv://medicappae:Medicappae@123@cluster0.bse7o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    username: "superuser",
    password: "supersecretpasswords",
    options: MONGO_OPTIONS,
    url: "mongodb+srv://medicappae:Medicappae@123@cluster0.bse7o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
};
// mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/Cluster0?retryWrites=true&w=majority
// mongodb+srv://medicappae:Medicappae@123@cluster0.bse7o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
var categories = [], services = [], specialities = [], doctors = [], families = [], hospitals = [], packageCategories = [], packages = [], patients = [], pointCodes = [], slots = [], users = [], vendors = [];
var migrateData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var options;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // GETTING DATA FROM DB_1
            return [4 /*yield*/, mongoose_1.default.connect(MONGO_DB_1.url, MONGO_DB_1.options)];
            case 1:
                // GETTING DATA FROM DB_1
                _a.sent();
                console.log("Connected with DB_1...");
                console.log("Getting documents from DB_1");
                return [4 /*yield*/, category_1.default.find({})];
            case 2:
                categories = _a.sent();
                return [4 /*yield*/, services_1.default.find({})];
            case 3:
                services = _a.sent();
                return [4 /*yield*/, speciality_1.default.find({})];
            case 4:
                specialities = _a.sent();
                return [4 /*yield*/, doctor_1.default.find({})];
            case 5:
                doctors = _a.sent();
                return [4 /*yield*/, family_1.default.find({})];
            case 6:
                families = _a.sent();
                return [4 /*yield*/, hospital_1.default.find({})];
            case 7:
                hospitals = _a.sent();
                return [4 /*yield*/, packageCategory_1.default.find({})];
            case 8:
                packageCategories = _a.sent();
                return [4 /*yield*/, package_1.default.find({})];
            case 9:
                packages = _a.sent();
                return [4 /*yield*/, patient_1.default.find({})];
            case 10:
                patients = _a.sent();
                return [4 /*yield*/, pointsCode_1.default.find({})];
            case 11:
                pointCodes = _a.sent();
                return [4 /*yield*/, slot_1.default.find({})];
            case 12:
                slots = _a.sent();
                return [4 /*yield*/, user_1.default.find({})];
            case 13:
                users = _a.sent();
                return [4 /*yield*/, vendor_1.default.find({})];
            case 14:
                vendors = _a.sent();
                // CLOSING CONNECTION OF DB_1
                return [4 /*yield*/, mongoose_1.default.connection.close()];
            case 15:
                // CLOSING CONNECTION OF DB_1
                _a.sent();
                // INSERTING DATA TO DB_2
                return [4 /*yield*/, mongoose_1.default.connect(MONGO_DB_2.url, MONGO_DB_2.options)];
            case 16:
                // INSERTING DATA TO DB_2
                _a.sent();
                console.log("Clearing the documents Of DB_2...");
                return [4 /*yield*/, category_1.default.deleteMany({})];
            case 17:
                _a.sent();
                return [4 /*yield*/, services_1.default.deleteMany({})];
            case 18:
                _a.sent();
                return [4 /*yield*/, speciality_1.default.deleteMany({})];
            case 19:
                _a.sent();
                console.log("Inserting documents");
                options = { ordered: true };
                return [4 /*yield*/, category_1.default.insertMany(categories, options)
                    //@ts-ignore
                ];
            case 20:
                _a.sent();
                //@ts-ignore
                console.log("Categories were inserted");
                return [4 /*yield*/, services_1.default.insertMany(services, options)
                    //@ts-ignore
                ];
            case 21:
                _a.sent();
                //@ts-ignore
                console.log("Services were inserted");
                return [4 /*yield*/, speciality_1.default.insertMany(specialities, options)
                    // @ts-ignore
                ];
            case 22:
                _a.sent();
                // @ts-ignore
                console.log("Specialities were inserted");
                return [4 /*yield*/, doctor_1.default.insertMany(doctors, options)
                    // @ts-ignore
                ];
            case 23:
                _a.sent();
                // @ts-ignore
                console.log("Doctors were inserted");
                return [4 /*yield*/, family_1.default.insertMany(families, options)
                    // @ts-ignore
                ];
            case 24:
                _a.sent();
                // @ts-ignore
                console.log("Families were inserted");
                return [4 /*yield*/, hospital_1.default.insertMany(hospitals, options)
                    // @ts-ignore
                ];
            case 25:
                _a.sent();
                // @ts-ignore
                console.log("Hospitals were inserted");
                return [4 /*yield*/, packageCategory_1.default.insertMany(packageCategories, options)
                    // @ts-ignore
                ];
            case 26:
                _a.sent();
                // @ts-ignore
                console.log("Package Categories were inserted");
                return [4 /*yield*/, package_1.default.insertMany(packages, options)
                    // @ts-ignore
                ];
            case 27:
                _a.sent();
                // @ts-ignore
                console.log("Packages were inserted");
                return [4 /*yield*/, patient_1.default.insertMany(patients, options)
                    // @ts-ignore
                ];
            case 28:
                _a.sent();
                // @ts-ignore
                console.log("Patients were inserted");
                return [4 /*yield*/, pointsCode_1.default.insertMany(pointCodes, options)
                    // @ts-ignore
                ];
            case 29:
                _a.sent();
                // @ts-ignore
                console.log("Point Codes were inserted");
                return [4 /*yield*/, slot_1.default.insertMany(slots, options)
                    // @ts-ignore
                ];
            case 30:
                _a.sent();
                // @ts-ignore
                console.log("Slots were inserted");
                return [4 /*yield*/, user_1.default.insertMany(users, options)
                    // @ts-ignore
                ];
            case 31:
                _a.sent();
                // @ts-ignore
                console.log("Users were inserted");
                return [4 /*yield*/, vendor_1.default.insertMany(vendors, options)
                    // @ts-ignore
                ];
            case 32:
                _a.sent();
                // @ts-ignore
                console.log("Vendors were inserted");
                process.exit();
                return [2 /*return*/];
        }
    });
}); };
migrateData();
// How to insert Lookups 
// In the terminal, go to this directory first and then run following command
// npx ts-node migrate_from_one_db_to_another.ts
