const admin = require("firebase-admin");
const serviceAccount = require("./fir-app-11c19-firebase-adminsdk-jh46b-37c37b7ccc.json");
// const databaseURL  = "https://pikway-39deb.firebaseio.com";
/////
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: databaseURL
});
let options ={
    priority : "high",
    timeToLive : 60 * 60 * 24,
    sound: "default"
};
const sendNotification = ( fcToken: any, payload : any ) => {
          
        admin.messaging().sendToDevice( fcToken , payload , options)
        .then( (send: any) => {
            console.log("send", send);
            return true;
        })
        .catch( (err: any) => {
            console.log("Error found!", err);
            return false;
        })
}

export default sendNotification;