'use strict';

angular.module('localParseServer.lostPassword', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('lostPassword', {
		url: '/lostPassword',
		templateUrl: "lostPassword/lostPassword.html",
		controller: "LostPasswordCtrl"
	})
}])

.controller('LostPasswordCtrl', ['$scope', '$state', '$http',  function ($scope, $state, $http) {
	$scope.account = {};

	$scope.lostPassword = account => {
		var User = Parse.Object.extend("User");
		var query = new Parse.Query(User);

		query.equalTo("username", account.email);

		query.find({
			success (data) {
				var user = data[0];
				alert("If that account exists, an email has been sent with a link to reset your password.");
				if (user) {
					// send password reset email to that user
					$http.post('/sendPasswordReset', {email: account.email}).then(
						data => console.log(data),
						err => console.log(err)
					);
				}

				$state.go('login');
			},
			error (err) {
				alert('Something went wrong...' + err);
			}
		})
	}

	$scope.goToState = state => {
		$state.go(state);
	}
}])