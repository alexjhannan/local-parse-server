'use strict';

angular.module('localParseServer.lostPassword', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('lostPassword', {
		url: '/lostPassword',
		templateUrl: "lostPassword/lostPassword.html",
		controller: "LostPasswordCtrl"
	})
}])

.controller('LostPasswordCtrl', ['$scope', '$state', function ($scope, $state) {
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
					// TODO: req to webhook -> reset password link
					console.log("Sending request to webhook...");
				}
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