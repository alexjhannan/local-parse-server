var express = require('express');
var app = express();
var Parse = require('parse/node');
var ParseServer = require('parse-server').ParseServer;
var bodyParser = require('body-parser');
var mailAdapter = require('./server/mailgun/mailgunAdapter.js');
var md5 = require("md5");

// load static files in public directory
app.use(express.static('client'));

// Specify the connection string for your mongodb database
// and the location to your Parse cloud code
var api = new ParseServer({
	databaseURI: 'mongodb://localhost:27017/dev',
	cloud: '/Users/AlexMac/Projects/local-parse-server/server/cloud/main.js',
	appId: 'localParseServer',
	masterKey: 'mySecretMasterKey',
	javaScriptKey: 'mySecretJavaScriptKey',
	serverURL: 'http://localhost:3000/parse'
});

app.use('/parse', api);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
});

app.use(bodyParser.json());

// ----------------------------------------------
//             WEBHOOKS
// ----------------------------------------------
app.post("/notifyEmailChange", (req, res) => {
	console.log("Sending email change notification to: " + req.body.oldEmail);

	var subject = "Your Email Address Has Been Changed";

	var body = "Your email address has been changed to: " + req.body.newEmail + ". If you did not authorize this request, please contact support.";

	mailAdapter.sendEmail(req.body.oldEmail, subject, body).then(
		() => {
			res.send("Email change notification sent successfully.");
		},
		() => {
			res.send("Error: Email change notification failed.");
		}
	);
});

app.post("/verifyEmail", (req, res) => {
	console.log("Sending verification email to: " + req.body.email);

	var subject = "Email Verification";

	var body = "Please verify your email by clicking the link below.";

	var link = "http://www.google.com";

	mailAdapter.sendEmail(req.body.email, subject, body, link).then(
		() => {
			res.send("Verification email sent successfully.");
		},
		() => {
			res.send("Error: Verification email failed.");
		}
	);
});

app.post("/notifyPasswordReset", (req, res) => {
	console.log("Sending password change notification to: " + req.body.email);

	var subject = "Your Password Has Been Changed";

	var body = "Your password has been changed. If you did not authorize this change, please contact support immediately.";

	mailAdapter.sendEmail(req.body.email, subject, body).then(
		() => {
			res.send("Notify password reset email sent successfully.");
		},
		() => {
			res.send("Error: Notify password reset email failed.");
		}
	);
});

app.post("/sendPasswordReset", (req, res) => {
	console.log("Sending password reset email to: " + req.body.email);

	var subject = "Password Reset";

	var body = "Click the link below to reset your password.";

	var link = "http://www.google.com";

	mailAdapter.sendEmail(req.body.email, subject, body, link).then(
		() => {
			res.send("Password reset email sent successfully.");
		},
		() => {
			res.send("Error: Password reset email failed.");
		}
	);
});

// ----------------------------------------------
//             OLD ROUTES
// ----------------------------------------------

app.post('/register', bodyParser.urlencoded({ extended: false }), (req, res) => {
	// create a user verification string
	var email = req.body.email;

	// sign up the user
	Parse.User.signUp(email, req.body.password, {
		// declare extra attributes
		}, {
		// callback object
		success (user) {
			// create a hash for the verification link
			var toHash = email + user.get("createdAt") + user.id;
			var hash = md5(toHash);
			var link = "http://localhost:3000/verify?email=" + email + "&hash=" + hash;

			var data = {
				from: 'Local Parse Server <alexjhannan@gmail.com>',
				to: email,
				subject: 'Verify Your Email',
				html: '<html><h3>Verify Your Email</h3><a href=\"' + link +'\">Click!</a></html>'
			};

			// fire off the email
			mailgun.messages().send(data, (err, body) => {
				if (err) console.log(err);
				console.log(body);
			});
		},
		error (err) {
			console.log(err);
		}
	});

	res.sendFile(__dirname + '/client/index.html');
});

app.get('/verify', (req, res) => {
	var result = req.query.email + '<br />' + req.query.hash + '<br />';

	var User = Parse.Object.extend("User");
	var query = new Parse.Query(User);

	query.equalTo("username", req.query.email);

	query.find({
		success(data) {
			var user = data[0];
			result += 'Attempting to verify... <br />';

			// test a new hash straight from parse against the link's hash
			var parseHash = md5(user.get("username") + user.get("createdAt") + user.id);
			var verifyMatch = req.query.hash === parseHash;

			if (verifyMatch) {
				// use master key to update account (since Node isn't logged in)
				Parse.Cloud.useMasterKey();
				user.set("verified", true);
				result += "Verification passed.";
				user.save();
			} else {
				result += "Verification failed.";
			}

			res.send(result);
		}
	});
});

app.get('/checkemail', (req, res) => {
	res.send("Please check your email.");
});

app.post('/lostpassword', bodyParser.urlencoded({extended: false}), (req, res) => {
	var email = req.body.email;

	var User = Parse.Object.extend("User");
	var query = new Parse.Query(User);

	query.equalTo("username", email);

	query.find({
		success (data) {
			var user = data[0];
			if (user){
				// if user exists, send a link to reset their password w/ a verification hash
				var toHash = email + user.get("createdAt") + user.id + "cattyPassphrase";
				var hash = md5(toHash);
				var link = "http://localhost:3000/resetpassword?email=" + email + "&hash=" + hash;

				var data = {
					from: 'Local Parse Server <alexjhannan@gmail.com>',
					to: email,
					subject: 'Reset Your Password',
					html: '<html><h3>Reset Your Password</h3><a href=\"' + link +'\">Click!</a></html>'
				};

				mailgun.messages().send(data, (err, body) => {
					if (err) console.log(err);
					console.log(body);
				});
			}
			res.send('If an account is associated with that address, an email has been dispatched with a link to reset your password.')
		},
		error (error) {
			res.send('Sorry, there was an error while processing your request.');
		}
	})
});

app.get('/resetpassword', (req, res) => {
	var email = req.query.email, hash = req.query.hash;

	var User = Parse.Object.extend("User");
	var query = new Parse.Query(User);

	query.equalTo("username", email);

	query.find({
		success (data) {
			var user = data[0];

			var toHash = email + user.get("createdAt") + user.id + "cattyPassphrase";
			var parseHash = md5(toHash);

			if (parseHash === hash){
				// if hash is correct, send user along (w/ query params) to the next step
				res.redirect('/choosepassword?email=' + email + '&hash=' + hash);
			} else {
				// else, send the user to an invalid link page
				res.sendFile(__dirname + '/client/html/invalid-link.html');
			}
		}
	});
});

app.get('/choosepassword', (req, res) => {
	// this route is just a redirect from /resetpassword's success case
	res.sendFile(__dirname + '/client/html/choose-password.html');
});

app.post('/choosepassword', bodyParser.urlencoded({extended: false}), (req, res) => {
	// check if passwords match; should actually happen before submitting the password
	if (req.body.password !== req.body.confirm) {
		res.send('Passwords do not match.');
	}

	var User = Parse.Object.extend("User");
	var query = new Parse.Query(User);

	query.equalTo("username", req.body.email);

	query.find({
		success (data) {
			var user = data[0];

			var toHash = req.body.email + user.get("createdAt") + user.id + "cattyPassphrase";
			var parseHash = md5(toHash);

			// test new parse hash and link hash against each other
			if (parseHash === req.body.hash) {
				console.log('Updating user.');
				Parse.Cloud.useMasterKey();
				user.set("password", req.body.password);
				user.save().then(() => {console.log('success, password changed to ' + req.body.password)})
			} else {
				console.log('Hash does not match.');
			}
		}
	});

	res.redirect('/');
});

var port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log('parse-server-example running on port ' + port + '.');
});