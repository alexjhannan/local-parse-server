'use strict';

angular.module('localParseServer.register', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('register', {
		url: '/register',
		templateUrl: "register/register.html",
		controller: "RegisterCtrl"
	})
}])

.controller('RegisterCtrl', ['$scope', '$state', function ($scope, $state) {
	$scope.account = {};

	$scope.signUp = account => {
		console.log(account);
		Parse.User.signUp(account.email, account.password, {}, {
			success (user) {
				alert("Successfully signed up as " + user.getUsername());
				// TODO: req to webhook -> verify email link
				$state.go('home');
			},
			error (err) {
				alert("Could not sign up with those credentials..." + err);
			}
		})
	}

	$scope.goToState = state => {
		$state.go(state);
	}
}])