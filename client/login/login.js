'use strict';

angular.module('localParseServer.login', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/login', {
		'templateUrl': 'login/login.html',
		'controller': 'LoginCtrl'
	})
}])

.controller('LoginCtrl', ['$scope', function ($scope) {
	$scope.account = {};

	var User = Parse.Object.extend("User");
	var query = new Parse.Query(User);

	query.equalTo("username", "alex@webjunto.com");

	query.find({
		success (users) {
			console.log(users[0].get("username"));
		},
		error (err) {
			console.log('Error case: ' + err);
		}
	});

	Parse.User.logIn('alex@webjunto.com', 'password', {
		success (user) {
			console.log(user.get("username"));
			console.log(Parse.User.current().get("username"));
		},
		error (err) {
			console.log(err);
		}
	});
}])