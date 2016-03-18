'use strict';

angular.module('localParseServer.changeEmail', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('changeEmail', {
		url: '/changeEmail',
		templateUrl: "changeEmail/changeEmail.html",
		controller: "ChangeEmailCtrl"
	})
}])

.controller('ChangeEmailCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {
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

					// send verification email to new email address
					$http.post('/verifyEmail', {email: account.newEmail}).then(
						data => console.log(data), 
						err => console.log(err)
					);
					// send notification email to old email address
					$http.post('/notifyEmailChange', {oldEmail: account.email, newEmail: account.newEmail}).then(
						data => console.log(data),
						err => console.log(err)
					);

					$state.go('home');
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