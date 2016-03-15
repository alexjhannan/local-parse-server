var express = require('express');
var Parse = require('parse/node');
var ParseServer = require('parse-server').ParseServer;
var bodyParser = require('body-parser');
var mailgunConfig = require('./mailgunAdapter.js');
var mailgun = mailgunConfig({ apiKey: 'key-dc299e12a327978cf917a45156cea004', domain: 'sandbox05212a27b5d24da3bdc19befaf7aeffe.mailgun.org' });

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
	// sign up the user
	Parse.User.signUp(req.body.email, req.body.password, {
		// declare extra attributes
		verify: 'verifyemailstring',
		ambidexterity: true,
		vaginas: 4,
		penii: 6.5,
		width: 9001
	}, {	
		// callback object
		success () {
			console.log('success!');
		},
		error (err) {
			console.log(err);
		}
	});

	mailgun.sendMail(req.body.email, "Oh hey!", "This is the body of the email.");

	res.sendFile(__dirname + '/register.html');
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log('parse-server-example running on port ' + port + '.');
});