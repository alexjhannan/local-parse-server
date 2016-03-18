'use strict';

angular.module('localParseServer.verifyEmail', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('verifyEmail', {
		url: '/verifyEmail/:email/:hash',
		templateUrl: "verifyEmail/verifyEmail.html",
		controller: "VerifyEmailCtrl"
	})
}])

.controller('VerifyEmailCtrl', ['$scope', '$state', '$http', '$stateParams', 'md5', function ($scope, $state, $http, $stateParams, md5) {
	var query = new Parse.Query("User");
	query.equalTo("username", $stateParams.email);

	query.first({
		success(user) {
			var toHash = user.getUsername() + user.get("createdAt") + user.id;
			var hash = md5.createHash(toHash);

			console.log(hash);

			console.log($stateParams.hash);

			if (hash === $stateParams.hash) {
				$scope.hashMatches = true;
				$scope.$apply();

				user.set("verified", true);
				user.save();
			}
		},
		error(err) {
			console.log("Could not find user.");
			console.log(err);
			$scope.hashDoesNotMatch = true;
		}
	})

	$scope.goToState = state => {
		$state.go(state);
	}
}])