import nodemailer from 'nodemailer';
import config from '../config/config';
import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(config.supportMailer.clientID, config.supportMailer.secretKey, config.supportMailer.redirect_uri);
oAuth2Client.setCredentials({ refresh_token: config.supportMailer.refresh_token });

export const sendSupportEmail = async (options: any, noReply: any) => {

	const accessToken = await oAuth2Client.getAccessToken();

	const transport = nodemailer.createTransport({
		// @ts-ignore
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: config.supportMailer.user,
			clientId: config.supportMailer.clientID,
			clientSecret: config.supportMailer.secretKey,
			refreshToken: config.supportMailer.refresh_token,
			accessToken: accessToken
		}
	})

	transport.sendMail(options).then((res: any) => {
		
		return true;
	}).catch((err: any) => {
		
		return false;
	})
};
