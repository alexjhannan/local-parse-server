'use strict';

angular.module("localParseServer", [
	'ui.router',
	'angular-md5',
	'localParseServer.login',
	'localParseServer.home',
	'localParseServer.lostPassword',
	'localParseServer.register',
	'localParseServer.changeEmail',
	'localParseServer.changePassword',
	'localParseServer.verifyEmail'
	])
	.run(function(){
		Parse.initialize('localParseServer', 'mySecretJavaScriptKey');
		Parse.serverURL = "http://localhost:3000/parse";
	})
	.config(['$urlRouterProvider', function ($urlRouterProvider) {
		$urlRouterProvider.otherwise('/login');
	}])