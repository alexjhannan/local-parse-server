'use strict';

angular.module("localParseServer", [
	'ui.router',
	'localParseServer.login',
	'localParseServer.home',
	'localParseServer.lostPassword',
	'localParseServer.register',
	'localParseServer.changeEmail'
	])
	.run(function(){
		Parse.initialize('localParseServer', 'mySecretJavaScriptKey');
		Parse.serverURL = "http://localhost:3000/parse";
	})
	.config(['$urlRouterProvider', function ($urlRouterProvider) {
		$urlRouterProvider.otherwise('/login');
	}])