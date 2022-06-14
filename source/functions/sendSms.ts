import config from '../config/config';
const smsglobal = require('smsglobal')(config.SMSGlobal.apiKey, config.SMSGlobal.secretKey);

const sendMessage = (destination: string, message: string) => {
	var payload = {
		origin: 'MEDICAPP',
		destination,
		message: message
	};

	console.log("payload => ", payload);

	smsglobal.sms.send(payload, function (error: any, response: any) {

		if (response) {
			console.log('Response:', response.data ? response.data : response);
		}

		if (error) {
			console.log('Error:', error);
		}

	});
}

export default sendMessage;