'use strict';

angular.module('localParseServer.register', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('register', {
		url: '/register',
		templateUrl: "register/register.html",
		controller: "RegisterCtrl"
	})
}])

.controller('RegisterCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$scope.account = {};

	$scope.signUp = account => {
		console.log(account);
		Parse.User.signUp(account.email, account.password, {}, {
			success (user) {
				alert("Successfully signed up as " + user.getUsername());
				// send verification email to new account
				$http.post('/verifyEmail', {email: account.email}).then(
					data => console.log(data),
					err => console.log(err)
				);
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