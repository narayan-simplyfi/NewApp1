'use strict';
(function() {
	var app = angular.module('myprojectsApp', ['ui.router', 'ngResource']);
   var imeino= '866104025429187';
   var admin = '9187admin';
	 var pass = 'admin9187';

	app.run(function($rootScope, $location, $state, LoginService) {
		if(!LoginService.isAuthenticated()) {
			$state.transitionTo('login');
		}
	});

	app.config(['$stateProvider', '$urlRouterProvider' ,'$locationProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('#/home');

		$stateProvider
			.state('login', {
				url : '/login',
				templateUrl : 'views/login.html',
				controller : 'LoginController'
			})
			.state('home', {
				url : '/home',
				templateUrl : 'views/home.html',
				controller : 'HomeController'
			});
	}]);

	app.controller('LoginController', function($scope, $rootScope, $stateParams, $state, LoginService) {
		$rootScope.title = 'Login Page';

		$scope.formSubmit = function() {
			if(LoginService.login($scope.username, $scope.password)) {
				$scope.error = '';
				$scope.username = '';
				$scope.password = '';
				$state.transitionTo('home');
			} else {
				$scope.error = 'Incorrect username/password !';
			}
		};

	});

	app.controller('HomeController',function($scope, $rootScope, UserService) {
		$scope.sdate='2017/05/22';
		$scope.edate='2017/05/23';
		$scope.query = function() {
			$scope.loading = true;
			UserService.get({imei: imeino}, {sdate: covertDate($scope.sdate), edate: covertDate($scope.edate)}).$promise.then(function(response){
				$rootScope.userDetail = response;
				$scope.loading = false;
			});
		};

		function covertDate(date) {
			return date.split('/').reverse().join('-');
		}
	});

	app.factory('UserService', function ($resource) {
		var data = $resource('http://108.161.140.163:8080/energizer/GetDeviceStatus?imei_no=:imei&start_date=:sdate&end_date=:edate',{imei: '@imei',sdate: '@sdate',edate: '@edate'});
		return data;
	});

	app.factory('LoginService', function() {

		var isAuthenticated = false;


		return {
			login : function(username, password) {
				isAuthenticated = username === admin && password === pass;
				return isAuthenticated;
			},
			isAuthenticated : function() {
				return isAuthenticated;
			}
		};

	});



})();
