'use strict';

angular.module('localParseServer.changeEmail', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('changeEmail', {
		url: '/changeEmail',
		templateUrl: "changeEmail/changeEmail.html",
		controller: "ChangeEmailCtrl"
	})
}])

.controller('ChangeEmailCtrl', ['$scope', '$state', function ($scope, $state) {
	// if client isn't logged in, send back to login page
	if (!Parse.User.current()) {
		alert('This page is only accessible to logged in users.'); 
		$state.go('login');
	}

	$scope.account = {};

	$scope.changeEmail = account => {
		if (account.newEmail !== account.confirmEmail) {
			return alert("New email and confirm email do not match.");
		}

		// convert to cloud code

		var User = Parse.Object.extend("User");
		var query = new Parse.Query(User);

		console.log(account.email);
		console.log(account.password);

		query.equalTo("username", account.email);
		query.equalTo("password", account.password);

		query.find({
			success (data) {

				console.log(data);
				var user = data[0];

				if (!user) {
					return console.log("Incorrect credentials.");
				}

				console.log(user.getUsername());
				console.log(user.get("password"));

				user.set("username", account.newEmail);
				user.save().then({
					success (user) {
						console.log(user);
						console.log("Email succcessfully changed to " + user.getUsername());
						// TODO: req to webhook -> notify old email
						// TODO: req to webhook -> verify new email
					},
					error (err) {
						console.log("Something went wrong... " + err);
					}
				})
			}
		})
	}

	$scope.logOut = () => {
		Parse.User.logOut();
		$state.go("login");
	}

	$scope.goToState = state => {
		$state.go(state);
	}
}])