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
var MONGO_HOST = process.env.MONGO_URL || 'mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/Cluster0?retryWrites=true&w=majority';
// mongodb://127.0.0.1:27017/medicapp
// mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/Cluster0?retryWrites=true&w=majority
// NODEMAILER OPTIONS
var CLIENT_ID = "389397570591-nosb4jnm4i3p13sm9mlpl4j10pkkujeo.apps.googleusercontent.com";
var CLIENT_SECRET = "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";
var REDIRECT_URI = "https://developers.google.com/oauthplayground";
var REFRESH_TOKEN = "1//04OpKKM7k0ZW2CgYIARAAGAQSNwF-L9Irr-y9gOsFwaupz60hPg54C439xsVd-Vpx6scTi53pTaTOLD-1zTRUQIXYXCa2jt5QP8o";
var MEDICAPP_EMAIL = "collaborations@medicappae.com";
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
    clientID: CLIENT_ID,
    secretKey: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    refresh_token: REFRESH_TOKEN,
    user: MEDICAPP_EMAIL
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
