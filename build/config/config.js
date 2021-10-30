"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/*** Server ***/
var SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
var SERVER_PORT = process.env.PORT || 8080;
var SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
var SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "coolIssuer";
var SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || "superencryptedsecret";
// const SERVER_HOST_URL = "https://secret-cove-54253.herokuapp.com";
var SERVER_HOST_URL = "http://localhost:1337";
var SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    APP_URL: SERVER_HOST_URL,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};
/*** MONGODB ***/
var MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false
};
var MONGO_USERNAME = process.env.MONGO_USERNAME || "superuser";
var MONGO_PASSWORD = process.env.MONGO_PASSWORD || "supersecretpasswords";
var MONGO_HOST = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/medicapp';
var NODEMAILER_USER = process.env.NODEMAILER_USER || "usamafarooq2007@gmail.com";
var NODEMAILER_PASS = process.env.NODEMAILER_PASS || "03157721671";
// mongodb://127.0.0.1:27017/medicapp
// mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/Cluster0?retryWrites=true&w=majority
// AWS S3 Bucket
var ACCESSKEYID = "AKIA3KPUHOWAFWNQKVFH";
var SECRETACCESSKEY = "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";
var BUCKET_NAME = "medicapp-bucket";
var MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_OPTIONS,
    url: MONGO_HOST
};
var BUCKET = {
    name: BUCKET_NAME,
    accessKeyId: ACCESSKEYID,
    secretAccessKey: SECRETACCESSKEY
};
var NODEMAILER = {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS
};
var config = {
    server: SERVER,
    mongo: MONGO,
    mailer: NODEMAILER,
    bucket: BUCKET
};
// Note: Application URL: https://sheltered-depths-86378.herokuapp.com
// Local URL: http://localhost:1337
exports.default = config;
