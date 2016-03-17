'use strict';

angular.module('localParseServer.home', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('home', {
		'url': '/home',
		'templateUrl': 'home/home.html',
		'controller': 'HomeCtrl'
	})
}])

.controller('HomeCtrl', ['$scope', '$state', '$timeout', function ($scope, $state, $timeout) {
	// if client isn't logged in, send back to login page
	if (!Parse.User.current()) {
		alert('This page is only accessible to logged in users.'); 
		$state.go('login');
	}

	$scope.accountName = Parse.User.current().getUsername();

	$scope.logOut = () => {
		Parse.User.logOut();
		$state.go("login");
	}

	$scope.goToState = state => {
		$state.go(state);
	}
}])