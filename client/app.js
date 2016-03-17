'use strict';

angular.module("localParseServer", [
	'ngRoute',
	'localParseServer.login'
	])
	.run(function(){
		Parse.initialize('localParseServer', 'mySecretJavaScriptKey');
		Parse.serverURL = "http://localhost:3000/parse";
	})
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/login'});
	}])