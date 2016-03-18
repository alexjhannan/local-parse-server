'use strict';

angular.module('localParseServer.changePassword', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('changePassword', {
		url: '/changePassword/:email/:hash',
		templateUrl: "changePassword/changePassword.html",
		controller: "ChangePasswordCtrl"
	})
}])

.controller('ChangePasswordCtrl', ['$scope', '$state', '$http', 'md5', '$stateParams', function ($scope, $state, $http, md5, $stateParams) {
	$scope.account = {};

	var query = new Parse.Query("User");
	query.equalTo("username", $stateParams.email);

	query.first({
		success(user) {
			// can we hide the plaintext string to make this hash more secure?
			var toHash = user.getUsername() + user.get("createdAt") + user.id + "passReset";
			var hash = md5.createHash(toHash);

			if (hash === $stateParams.hash) {
				$scope.hashMatches = true;
				$scope.$apply();
			} else {
				$scope.hashDoesNotMatch = true;
				$scope.$apply();
			}
		}
	});

	$scope.changePassword = account => {
		if (account.newPassword !== account.confirmPassword) {
			return alert("Passwords do not match.");
		}

		if (account.email !== $stateParams.email){
			return alert("You do not have access to that account.");
		}

		Parse.User.logIn(account.email, account.password, {
			success(user) {
				user.set("password", account.newPassword);
				user.save();

				alert("Successfully changed password.");

				$http.post('/notifyPasswordReset', {email: user.getUsername()});

				$state.go('login');
			},
			error(err) {
				alert("Current username and password do not match.");
			}
		})
	}

	$scope.goToState = state => {
		$state.go(state);
	}
}])