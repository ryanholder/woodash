// Woodash App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'woodash' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'woodash.controllers' is found in controllers.js

angular.module('woodash', [
	'ionic',
	'woodash.filters',
	'woodash.services',
	'woodash.directives',
	'woodash.controllers'
])

.run(['$rootScope', '$state', '$ionicPlatform', function ($rootScope, $state, $ionicPlatform) {
	$ionicPlatform.ready(function () {
		if ( !ionic.Platform.isIPad() || !ionic.Platform.isAndroid() ) {
			ionic.Platform.platforms.push('chromeapp');
		}

		chrome.identity.getAuthToken({ 'interactive': false }, function (token) {
			if (chrome.runtime.lastError) {
				$state.go('public.login');
			} else {
				$state.go('app.overview');
			}
		});

		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
}])

.config(function ($compileProvider) {
	$compileProvider
		.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
})

.config(function ($compileProvider, $stateProvider, $urlRouterProvider) {
	$stateProvider

		.state('app', {
			url: "/app",
			abstract: true,
			templateUrl: "templates/menu/app.html",
			controller: 'AppCtrl',
			data: {
				authenticate: true
			}
		})

		.state('app.overview', {
			url: "/overview",
			views: {
				'menuContent': {
					templateUrl: "templates/overview.html",
					controller: 'OverviewCtrl'
				}
			}
		})

		.state('app.dashboard', {
			url: "/dashboard",
			views: {
				'menuContent': {
					templateUrl: "templates/dashboard.html",
					controller: 'DashboardCtrl'
				}
			}
		})

		.state('app.twitter', {
			url: "/twitter",
			views: {
				'menuContent': {
					templateUrl: "templates/dashboard.twitter.html"
				}
			}
		})

		.state('app.facebook', {
			url: "/facebook",
			views: {
				'menuContent': {
					templateUrl: "templates/dashboard.facebook.html"
				}
			}
		})

		.state('app.bbc', {
			url: "/bbc",
			views: {
				'menuContent': {
					templateUrl: "templates/dashboard.bbc.html"
				}
			}
		})

		.state('app.woodash', {
			url: "/woodash",
			views: {
				'menuContent': {
					templateUrl: "templates/woodash.html",
					controller: 'UppCtrl'
				}
			}
		})

		.state('app.woodash.add', {
			url: "/woodash/add",
			views: {
				'menuContent': {
					templateUrl: "templates/woodash.add.html",
					controller: 'UppCtrl'
				}
			}
		})

		.state('app.single', {
			url: "/dashboard/:playlistId",
			views: {
				'menuContent': {
					templateUrl: "templates/playlist.html",
					controller: 'PlaylistCtrl'
				}
			}
		})

		.state('public', {
			url: "/public",
			abstract: true,
			templateUrl: "templates/menu/public.html",
			data: {
				authenticate: false
			}
		})

		.state('public.introduction', {
			url: "/introduction",
			views: {
				'publicContent': {
					templateUrl: "templates/introduction.html",
					controller: 'IntroductionCtrl'
				}
			}
		})

		.state('public.login', {
			url: '/login',
			views: {
				'publicContent': {
					templateUrl: "templates/login.html",
					controller: 'LoginCtrl'
				}
			}
		});
});

