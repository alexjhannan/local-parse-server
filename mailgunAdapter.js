var Mailgun = require('mailgun-js');

var SimpleMailgunAdapter = mailgunOptions => {
	if (!mailgunOptions || !mailgunOptions.apiKey || !mailgunOptions.domain) {
		throw 'SimpleMailgunAdapter requires an API Key and domain.';
	}
	var mailgun = Mailgun(mailgunOptions);

	var sendMail = (to, subject, text) => {
		var data = {
			from: mailgunOptions.fromAddress,
			to: to,
			subject: subject,
			text: text,
		}

		return new Promise((resolve, reject) => {
			mailgun.messages().send(data, (err, body) => {
				if (typeof err !== 'undefined') {
					console.log(err);
					reject(err);
				}
				resolve(body);
			});
		});
	}

	return Object.freeze({
    sendMail: sendMail
	});
}

module.exports = SimpleMailgunAdapter