import nodemailer from 'nodemailer';
import config from '../config/config';
import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(config.noReplyMailer.clientID, config.noReplyMailer.secretKey, config.noReplyMailer.redirect_uri);
oAuth2Client.setCredentials({ refresh_token: config.noReplyMailer.refresh_token });

export const sendNoReplyEmail = async (options: any, noReply: any) => {

	const accessToken = await oAuth2Client.getAccessToken();

	const transport = nodemailer.createTransport({
		// @ts-ignore
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: 'noreply@medicappae.com',
			clientId: config.noReplyMailer.clientID,
			clientSecret: config.noReplyMailer.secretKey,
			refreshToken: config.noReplyMailer.refresh_token,
			accessToken: accessToken
		}
	})

	transport.sendMail(options).then((res: any) => {
		console.log("No Reply Email Sent");
		return true;
	}).catch((err: any) => {
		console.log("No Reply Email Sent Error: ", err);
		return false;
	})
};
