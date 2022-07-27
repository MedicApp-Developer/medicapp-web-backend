import config from '../config/config';
const smsglobal = require('smsglobal')(config.SMSGlobal.apiKey, config.SMSGlobal.secretKey);

const sendMessage = (destination: string, message: string) => {
	var payload = {
		origin: 'MEDICAPP',
		destination,
		message: message
	};

	

	smsglobal.sms.send(payload, function (error: any, response: any) {

		if (response) {
			
		}

		if (error) {
			
		}

	});
}

export default sendMessage;