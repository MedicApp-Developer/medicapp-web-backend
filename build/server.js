"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var http_1 = __importDefault(require("http"));
var body_parser_1 = __importDefault(require("body-parser"));
// @ts-ignore
var express_1 = __importDefault(require("express"));
var logging_1 = __importDefault(require("./config/logging"));
var config_1 = __importDefault(require("./config/config"));
var mongoose_1 = __importDefault(require("mongoose"));
var user_1 = __importDefault(require("./routes/user"));
var patient_1 = __importDefault(require("./routes/patient"));
var hospital_1 = __importDefault(require("./routes/hospitals/hospital"));
var category_1 = __importDefault(require("./routes/category"));
var services_1 = __importDefault(require("./routes/hospitals/services"));
var doctor_1 = __importDefault(require("./routes/doctors/doctor"));
var nurse_1 = __importDefault(require("./routes/nurse/nurse"));
var labortory_1 = __importDefault(require("./routes/labortories/labortory"));
var appointments_1 = __importDefault(require("./routes/appointments"));
var pharmacy_1 = __importDefault(require("./routes/pharmacy/pharmacy"));
var branch_1 = __importDefault(require("./routes/pharmacy/branch"));
var labRequest_1 = __importDefault(require("./routes/labortories/labRequest"));
var promos_1 = __importDefault(require("./routes/hospitals/promos"));
var cors_1 = __importDefault(require("cors"));
var NAMESPACE = 'Server';
var router = express_1.default();
router.use(cors_1.default());
/** Connect to MONGO **/
mongoose_1.default.connect(config_1.default.mongo.url, config_1.default.mongo.options)
    .then(function (result) {
    logging_1.default.info(NAMESPACE, "Connected to MongoDB!");
}).catch(function (error) {
    logging_1.default.error(NAMESPACE, error.message, error);
});
/** Log the request */
router.use(function (req, res, next) {
    /** Log the req */
    logging_1.default.info(NAMESPACE, "METHOD: [" + req.method + "] - URL: [" + req.url + "] - IP: [" + req.socket.remoteAddress + "]");
    res.on('finish', function () {
        /** Log the res */
        logging_1.default.info(NAMESPACE, "METHOD: [" + req.method + "] - URL: [" + req.url + "] - STATUS: [" + res.statusCode + "] - IP: [" + req.socket.remoteAddress + "]");
    });
    next();
});
/** Parse the body of the request */
router.use(body_parser_1.default.urlencoded({ extended: true, limit: '50mb' }));
router.use(body_parser_1.default.json({ limit: '50mb' }));
// router.use(cors({credentials: true, origin: 'http://localhost:3000'}));
/** Rules of our API */
router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
// Upload Files Setup
router.use(express_1.default.static("./source/images"));
// Note:- Simply save ( req.file/files.filename ) into the database and then get the file with URL:- http://localhost:1337/filename
router.use(body_parser_1.default.urlencoded({ extended: true, limit: "100mb", parameterLimit: 10000000 }));
router.use(body_parser_1.default.json({ limit: "50mb", extended: true }));
/** Routes go here */
router.use('/api/users', user_1.default);
router.use('/api/patients', patient_1.default);
router.use('/api/hospitals', hospital_1.default);
router.use('/api/categories', category_1.default);
router.use('/api/hospitals/services', services_1.default);
router.use('/api/doctors', doctor_1.default);
router.use('/api/nurse', nurse_1.default);
router.use('/api/labortories', labortory_1.default);
router.use('/api/appointments', appointments_1.default);
router.use('/api/pharmacy', pharmacy_1.default);
router.use('/api/pharmacy/branch', branch_1.default);
router.use('/api/labRequests', labRequest_1.default);
router.use('/api/promos', promos_1.default);
// Simple Root Message
router.get('/', function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Welcome to Medicapp</title></head>");
    res.write("<body><h4>Welcome to Medicappae Backend API's, Please use Postman Collection for respective API's ( 2nd Demo )</h4></body>");
    res.write("</html>");
    return res.end();
});
/** Error handling */
router.use(function (req, res, next) {
    var error = new Error('Not found');
    res.status(404).json({
        message: error.message
    });
});
var httpServer = http_1.default.createServer(router);
httpServer.listen(config_1.default.server.port, function () { return logging_1.default.info(NAMESPACE, "Server is running " + config_1.default.server.hostname + ":" + config_1.default.server.port); });
