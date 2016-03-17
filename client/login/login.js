'use strict';

angular.module('localParseServer.login', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('login', {
		url: '/login',
		templateUrl: "login/login.html",
		controller: "LoginCtrl"
	})
}])

.controller('LoginCtrl', ['$scope', '$state', function ($scope, $state) {
	$scope.account = {};

	$scope.logIn = account => {
		Parse.User.logIn(account.email, account.password, {
			success (data) {
				console.log('User logged in.');
				console.log(data);
				$state.go("home");
			},
			error (err) {
				console.log('Error');
				console.log(err);
			}
		});
	}

	/* Example calls to parse

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
	}); */
}])