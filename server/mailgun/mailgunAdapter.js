var mailgun = require('mailgun-js')({ apiKey: 'key-dc299e12a327978cf917a45156cea004', domain: 'sandbox05212a27b5d24da3bdc19befaf7aeffe.mailgun.org' });

var sendEmail = (email, subject, body, link) => {
	// only email & subject are required; body & link are optional

	// build up html of email
	var html = "<html><h3>" + subject + "</h3>";
	if (body) {
		html += "<p>" + body + "</p>";
	}
	if (link) {
		html += "<a href='" + link + "\'>" + link + "</a>";
	}
	html += "</html>";

	// prepare data object
	var data = {
		from: 'Local Parse Server <alexjhannan@gmail.com>',
		to: email,
		subject: subject,
		html: html,
	};

	// fire off the mail
	mailgun.messages().send(data, (err, body) => {
		if (err) console.log(err);
		console.log(body);
	});
}

module.exports = {sendEmail};