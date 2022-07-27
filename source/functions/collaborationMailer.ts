import nodemailer from 'nodemailer';
import config from '../config/config';
import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(config.mailer.clientID, config.mailer.secretKey, config.mailer.redirect_uri);
oAuth2Client.setCredentials({ refresh_token: config.mailer.refresh_token });

export const sendCollaborationsEmail = async (options: any, noReply: any) => {

    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
        // @ts-ignore
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: config.mailer.user,
            clientId: config.mailer.clientID,
            clientSecret: config.mailer.secretKey,
            refreshToken: config.mailer.refresh_token,
            accessToken: accessToken
        }
    })

    transport.sendMail(options).then((res: any) => {
        
        return true;
    }).catch((err: any) => {
        
        return false;
    })
};
