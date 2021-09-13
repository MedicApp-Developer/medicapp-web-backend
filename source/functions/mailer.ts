import nodemailer from 'nodemailer';
import config from '../config/config';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.mailer.user,
        pass: config.mailer.pass
    }
});

// For Reference
// const options = {
//     from: "usamafarooq2007@gmail.com",
//     to: "usamamughal2007@gmail.com, muhammadusama2007@gmail.com",
//     cc: "usamamughal2007@gmail.com",
//     bcc: "usamamughal2007@gmail.com",
//     subject: "Sending Test Email With Node",
//     text: "WOW! That's Simple"
// }

export const sendEmail = (options: any) => {
    transporter.sendMail(options).then((res: any) => {
        console.log("Email Sent");
        return true;
    }).catch((err: any) => {
        console.log("Email Sent Error: ", err);
        return false;
    })
};
