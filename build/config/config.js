"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/*** Server ***/
var SERVER_HOSTNAME = process.env.SERVER_HOSTNAME;
var SERVER_PORT = process.env.PORT;
var SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME;
var SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER;
var SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET;
// const SERVER_HOST_URL = "https://medicappae.com";
var SERVER_HOST_URL = process.env.SERVER_HOST_URL;
var CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
var CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
var CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
var SMSGLOBAL_API_KEY = process.env.SMSGLOBAL_API_KEY;
var SMSGLOBAL_API_SECRET = process.env.SMSGLOBAL_API_SECRET;
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
    retryWrites: false,
    useFindAndModify: false
};
var MONGO_USERNAME = process.env.MONGO_USERNAME;
var MONGO_PASSWORD = process.env.MONGO_PASSWORD;
var MONGO_HOST = process.env.MONGO_URL;
// mongodb://127.0.0.1:27017/medicapp
// mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/Cluster0?retryWrites=true&w=majority
// NODEMAILER OPTIONS
var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;
var REDIRECT_URI = process.env.REDIRECT_URI;
var REFRESH_TOKEN = process.env.REFRESH_TOKEN;
var MEDICAPP_EMAIL = process.env.MEDICAPP_EMAIL;
// AWS S3 Bucket
var ACCESSKEYID = process.env.ACCESSKEYID;
var SECRETACCESSKEY = process.env.SECRETACCESSKEY;
var BUCKET_NAME = process.env.BUCKET_NAME;
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
var cloudinary = {
    name: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    secretKey: CLOUDINARY_API_SECRET
};
// SMSGlobal (MXT)
var SMSGlobal = {
    apiKey: SMSGLOBAL_API_KEY,
    secretKey: SMSGLOBAL_API_SECRET
};
var config = {
    server: SERVER,
    mongo: MONGO,
    mailer: NODEMAILER,
    bucket: BUCKET,
    cloudinary: cloudinary,
    SMSGlobal: SMSGlobal
};
// Note: Application URL: https://sheltered-depths-86378.herokuapp.com
// Local URL: http://localhost:1337
exports.default = config;
