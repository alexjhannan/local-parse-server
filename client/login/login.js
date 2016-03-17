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
			success (user) {
				console.log("Successfully signed in as " + user.getUsername());
				$state.go("home");
			},
			error (err) {
				console.log("Cannot log in with those credentials.");
			}
		});
	}

	$scope.goToState = state => {
		$state.go(state);
	}
}])