'use strict';

angular.module('localParseServer.verifyEmail', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('verifyEmail', {
		url: '/verifyEmail',
		templateUrl: "verifyEmail/verifyEmail.html",
		controller: "VerifyEmailCtrl"
	})
}])

.controller('VerifyEmailCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$scope.account = {};

	$scope.goToState = state => {
		$state.go(state);
	}
}])