// Woodash App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'woodash' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'woodash.controllers' is found in controllers.js

angular.module('woodash', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ui.router',
	'ionic',
	'woodash.filters',
	'woodash.services',
	'woodash.directives',
	'woodash.controllers',
	'mgcrea.ngStrap'
])

.run(['$rootScope', '$state', '$ionicPlatform', function ($rootScope, $state, $ionicPlatform) {
	$ionicPlatform.ready(function () {
		if ( !ionic.Platform.isIPad() || !ionic.Platform.isAndroid() ) {
			ionic.Platform.platforms.push('chromeapp');
		}

		$state.go('app.overview');

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

.config(function ($compileProvider, $stateProvider) {
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

        .state('app.customers', {
            url: "/customers",
            views: {
                'menuContent': {
                    templateUrl: "templates/customers.html",
                    controller: 'CustomersCtrl'
                }
            }
        })

        .state('app.products', {
            url: "/products",
            views: {
                'menuContent': {
                    templateUrl: "templates/products.html",
                    controller: 'ProductsCtrl'
                }
            }
        })

        .state('app.orders', {
            url: "/orders",
            views: {
                'menuContent': {
                    templateUrl: "templates/orders.html",
                    controller: 'OrdersCtrl'
                }
            }
        })

});
