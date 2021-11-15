import dotenv from 'dotenv';

dotenv.config();

/*** Server ***/ 
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.PORT || 8080;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "coolIssuer";
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || "superencryptedsecret";
// const SERVER_HOST_URL = "https://secret-cove-54253.herokuapp.com";
const SERVER_HOST_URL = "http://localhost:1337";

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
    retryWrites: false
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || "superuser";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "supersecretpasswords";
const MONGO_HOST = process.env.MONGO_URL || 'mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/Cluster0?retryWrites=true&w=majority';

// mongodb://127.0.0.1:27017/medicapp
// mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/Cluster0?retryWrites=true&w=majority

// NODEMAILER OPTIONS
const CLIENT_ID = "389397570591-nosb4jnm4i3p13sm9mlpl4j10pkkujeo.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04OpKKM7k0ZW2CgYIARAAGAQSNwF-L9Irr-y9gOsFwaupz60hPg54C439xsVd-Vpx6scTi53pTaTOLD-1zTRUQIXYXCa2jt5QP8o";
const MEDICAPP_EMAIL = "collaborations@medicappae.com";


// AWS S3 Bucket
const ACCESSKEYID = "AKIA3KPUHOWAHZI57N3P";
const SECRETACCESSKEY = "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";
const BUCKET_NAME = "medicapp-bucket";

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

const config = {
    server: SERVER,
    mongo: MONGO,
    mailer: NODEMAILER,
    bucket: BUCKET
};

// Note: Application URL: https://sheltered-depths-86378.herokuapp.com
// Local URL: http://localhost:1337

export default config;
