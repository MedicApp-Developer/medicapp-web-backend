import dotenv from 'dotenv';

dotenv.config();

/*** Server ***/
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME;
const SERVER_PORT = process.env.PORT;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER;
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET;
// const SERVER_HOST_URL = "https://medicappae.com";
const SERVER_HOST_URL = process.env.SERVER_HOST_URL;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const SMSGLOBAL_API_KEY = process.env.SMSGLOBAL_API_KEY;
const SMSGLOBAL_API_SECRET = process.env.SMSGLOBAL_API_SECRET;

const SERVER = {
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

const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false,
    useFindAndModify: false
};

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOST = process.env.MONGO_URL;

// mongodb://127.0.0.1:27017/medicapp
// mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/Cluster0?retryWrites=true&w=majority

// NODEMAILER OPTIONS
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const MEDICAPP_EMAIL = process.env.MEDICAPP_EMAIL;

// NO_REPLY_MAIL_OPTION
const NO_REPLY_CLIENT_ID = process.env.NO_REPLY_EMAIL_CLIENT_ID;
const NO_REPLY_CLIENT_SECRET = process.env.NO_REPLY_EMAIL_SECRET_ID;
const NO_REPLY_REDIRECT_URI = process.env.NO_REPLY_REDIRECT_URI;
const NO_REPLY_REFRESH_TOKEN = process.env.NO_REPLY_REFRESH_TOKEN;
const NO_REPLY_MEDICAPP_EMAIL = process.env.NO_REPLY_EMAIL;

// SUPPORT_REPLY_EMAIL_OPTIONS
const SUPPORT_REPLY_CLIENT_ID = process.env.SUPPORT_REPLY_EMAIL_CLIENT_ID;
const SUPPORT_REPLY_CLIENT_SECRET = process.env.SUPPORT_REPLY_EMAIL_SECRET_ID;
const SUPPORT_REPLY_REDIRECT_URI = process.env.SUPPORT_REPLY_REDIRECT_URI;
const SUPPORT_REPLY_REFRESH_TOKEN = process.env.SUPPORT_REPLY_REFRESH_TOKEN;
const SUPPORT_REPLY_MEDICAPP_EMAIL = process.env.SUPPORT_REPLY_EMAIL;


// AWS S3 Bucket
const ACCESSKEYID = process.env.ACCESSKEYID;
const SECRETACCESSKEY = process.env.SECRETACCESSKEY;
const BUCKET_NAME = process.env.BUCKET_NAME;

const MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_OPTIONS,
    url: MONGO_HOST
}

const BUCKET = {
    name: BUCKET_NAME,
    accessKeyId: ACCESSKEYID,
    secretAccessKey: SECRETACCESSKEY
}

const NODEMAILER = {
    clientID: CLIENT_ID,
    secretKey: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    refresh_token: REFRESH_TOKEN,
    user: MEDICAPP_EMAIL
}

const NO_REPLY_NODEMAILER = {
    clientID: NO_REPLY_CLIENT_ID,
    secretKey: NO_REPLY_CLIENT_SECRET,
    redirect_uri: NO_REPLY_REDIRECT_URI,
    refresh_token: NO_REPLY_REFRESH_TOKEN,
    user: NO_REPLY_MEDICAPP_EMAIL
}

const SUPPORT_REPLY_NODEMAILER = {
    clientID: SUPPORT_REPLY_CLIENT_ID,
    secretKey: SUPPORT_REPLY_CLIENT_SECRET,
    redirect_uri: SUPPORT_REPLY_REDIRECT_URI,
    refresh_token: SUPPORT_REPLY_REFRESH_TOKEN,
    user: SUPPORT_REPLY_MEDICAPP_EMAIL
}

const cloudinary = {
    name: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    secretKey: CLOUDINARY_API_SECRET
}

// SMSGlobal (MXT)
const SMSGlobal = {
    apiKey: SMSGLOBAL_API_KEY,
    secretKey: SMSGLOBAL_API_SECRET
}

const config = {
    server: SERVER,
    mongo: MONGO,
    mailer: NODEMAILER,
    noReplyMailer: NO_REPLY_NODEMAILER,
    supportMailer: SUPPORT_REPLY_NODEMAILER,
    bucket: BUCKET,
    cloudinary,
    SMSGlobal
};

// Note: Application URL: https://sheltered-depths-86378.herokuapp.com
// Local URL: http://localhost:1337

export default config;
