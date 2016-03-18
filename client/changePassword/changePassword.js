'use strict';

angular.module('localParseServer.changePassword', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('changePassword', {
		url: '/changePassword',
		templateUrl: "changePassword/changePassword.html",
		controller: "ChangePasswordCtrl"
	})
}])

.controller('ChangePasswordCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$scope.account = {};

	$scope.goToState = state => {
		$state.go(state);
	}
}])