var express = require('express');
var Parse = require('parse/node');
var ParseServer = require('parse-server').ParseServer;
var bodyParser = require('body-parser');
var mailgun = require('mailgun-js')({ apiKey: 'key-dc299e12a327978cf917a45156cea004', domain: 'sandbox05212a27b5d24da3bdc19befaf7aeffe.mailgun.org' });
var sha = require("sha");
var app = express();

// Specify the connection string for your mongodb database
// and the location to your Parse cloud code
var api = new ParseServer({
	databaseURI: 'mongodb://localhost:27017/dev',
	cloud: '/Users/AlexMac/Projects/local-parse-server/node_modules/parse-server/lib/cloud/main.js',
	appId: 'myAppId',
	masterKey: 'mySecretMasterKey',
	fileKey: 'optionalFileKey',
	serverURL: 'http://localhost:3000/parse'
});

app.use('/parse', api);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/register.html');
});

app.post('/register', bodyParser.urlencoded({ extended: false }), (req, res) => {
	// create a user verification string
	var verifyString = "verification12345";
	var email = req.body.email;

	// sign up the user
	Parse.User.signUp(email, req.body.password, {
		// declare extra attributes
		verify: verifyString
		}, {
		// callback object
		success () {
			console.log('success!');
		},
		error (err) {
			console.log(err);
		}
	});

	var data = {
		from: 'Excited User <alexjhannan@gmail.com>',
		to: 'alex@webjunto.com',
		subject: 'Verify Your Email',
		html: '<html><h3>Verify Your Email</h3><a href=' + '\"http://localhost:3000/verify?email=' + email + '&verifyString=' + verifyString +'\">Verify your email</a></html>'
	};

	mailgun.messages().send(data, (error, body) => {
		if (err) console.log(err);
		console.log(body);
	});

	res.redirect('/');
});

app.get('/verify', (req, res) => {
	var result = req.query.email + '<br />' + req.query.verifyString + '<br />';

	var User = Parse.Object.extend("User");
	var query = new Parse.Query(User);

	query.equalTo("username", req.query.email);

	query.find({
		success(data) {
			var user = data[0];
			console.log("user = " + JSON.stringify(user));
			result += 'Attempting to verify... <br />';
			var verifyMatch = req.query.verifyString == user.get("verify");

			if (verifyMatch) {
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

var port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log('parse-server-example running on port ' + port + '.');
});