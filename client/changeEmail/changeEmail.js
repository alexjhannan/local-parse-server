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

		// use Parse Cloud to check if login is correct
		Parse.Cloud.run("logIn", {account: $scope.account}).then(user => {
			user.set("username", account.newEmail);
			user.save({
				success (user) {
					console.log("Successfully changed email to " + user.getUsername());
					// TODO: webhook -> verify new email
					// TODO: webhook -> notify old email
				},
				error (err) {
					console.log(err);
				}
			});
		}, err => {
			alert("Error: " + err.message);
		});
	}

	$scope.logOut = () => {
		Parse.User.logOut();
		$state.go("login");
	}

	$scope.goToState = state => {
		$state.go(state);
	}
}])