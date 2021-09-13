import dotenv from 'dotenv';

dotenv.config();

/*** Server ***/ 
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.PORT || 1337;
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
const MONGO_HOST = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/medicapp';
const NODEMAILER_USER = process.env.NODEMAILER_USER || "usamafarooq2007@gmail.com";
const NODEMAILER_PASS = process.env.NODEMAILER_PASS || "03157721671"
// mongodb://127.0.0.1:27017/medicapp
// mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_OPTIONS,
    url: MONGO_HOST
}

const NODEMAILER = {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS
}

const config = {
    server: SERVER,
    mongo: MONGO,
    mailer: NODEMAILER
};

// Note: Application URL: https://secret-cove-54253.herokuapp.com
// Local URL: http://localhost:1337

export default config;
