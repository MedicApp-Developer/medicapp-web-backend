const admin = require("firebase-admin");
const serviceAccount = require("./medicapp-find-doctors-firebase-adminsdk-ps18y-150941073c.json");
/////
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: databaseURL
});
let options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
    sound: "default"
};
const sendNotification = (fcToken: any, payload: any) => {

    admin.messaging().sendToDevice(fcToken, payload, options)
        .then((send: any) => {
            
            return true;
        })
        .catch((err: any) => {
            
            return false;
        })
}

export default sendNotification;