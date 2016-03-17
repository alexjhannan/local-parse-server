'use strict';

angular.module('localParseServer.home', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('home', {
		'url': '/home',
		'templateUrl': 'home/home.html',
		'controller': 'HomeCtrl'
	})
}])

.controller('HomeCtrl', ['$scope', '$state', function ($scope, $state) {
	if (!Parse.User.current()) {$state.go("login")}

	$scope.accountName = Parse.User.current().getUsername();

	$scope.logOut = () => {
		console.log("attempting to log out...");
		Parse.User.logOut();
	}
}])