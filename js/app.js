// Woodash App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'woodash' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'woodash.controllers' is found in controllers.js

angular.module('woodash', [
    'ngAnimate',
    'ngSanitize',
    'restangular',
    'ui.router',
	'ionic',
    'angularMoment',
    'mgcrea.ngStrap',
    'woodash.filters',
    'woodash.services',
    'woodash.directives',
    'woodash.controllers'
])

    .config(function ($compileProvider) {
        $compileProvider
            .aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    })

    .config(function ($compileProvider, $stateProvider) {
        $stateProvider

            .state('signin', {
                url: "/signin",
                data: {
                    roles: ['Admin']
                },
                templateUrl: "templates/dashboard.html"
            })

            .state('app', {
                url: "/app",
                abstract: true,
                resolve: {
                    authorize: ['authorization',
                        function(authorization) {
                            return authorization.authorize();
                        }
                    ]
                }
            })

            .state('app.console', {
                url: "/console",
                abstract: true,
                templateUrl: "templates/menu/app.html",
                controller: 'AppCtrl as app'
            })

            .state('app.console.dashboard', {
                url: "/dashboard",
                data: {
                    roles: ['Admin']
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/dashboard.html",
                        controller: 'DashboardCtrl as dashboard'
                    }
                },
                onEnter: function(){
                    console.log('hello onEnter');
                }
            })

            .state('app.site', {
                url: "/site",
                abstract: true,
                templateUrl: "templates/menu/site.html",
                controller: 'SiteCtrl'
            })

            .state('app.site.overview', {
                url: "/overview",
                views: {
                    'menuContent': {
                        templateUrl: "templates/overview.html",
                        controller: 'OverviewCtrl',
                        resolve:{
                            initOverview: function(InitOverviewService) {
                                return InitOverviewService;
                            }
                        }
                    }
                }
            })

            .state('app.site.customers', {
                url: "/customers",
                views: {
                    'menuContent': {
                        templateUrl: "templates/customers.html",
                        controller: 'CustomersCtrl'
                    }
                }
            })

            .state('app.site.products', {
                url: "/products",
                views: {
                    'menuContent': {
                        templateUrl: "templates/products.html",
                        controller: 'ProductsCtrl'
                    }
                }
            })

            .state('app.site.orders', {
                url: "/orders",
                views: {
                    'menuContent': {
                        templateUrl: "templates/orders.html",
                        controller: 'OrdersCtrl'
                    }
                }
            })

    })

    .config(function(RestangularProvider) {

        RestangularProvider.setBaseUrl('https://wp.thewhatwhat.com/wc-api/v1');
        RestangularProvider.setDefaultRequestParams({
            consumer_key: "ck_45841d89825d617a00814f88e74face7",
            consumer_secret: "cs_d6da0b74e1f26cdd1f6bb6c8a0207e90"
        });

        // add a response intereceptor
        // todo: require due to "Response for getList SHOULD be an array and not an object or something else..."
        RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
            var extractedData;

            // .. to look for getList operations
            if (operation === "getList") {
                // .. and handle the data and meta data
                if (what === '') {
                    //todo: should I be converting retuned data to array or leave as object
                    extractedData = _.toArray(data);
                } else {
                    extractedData = data[what];
                }
            }

            return extractedData;
        });

    })

    .run(['$rootScope', '$state', '$ionicPlatform', 'InitDashboardService', function ($rootScope, $state, $ionicPlatform, InitDashboardService) {
        $ionicPlatform.ready(function () {
            if ( !ionic.Platform.isIPad() || !ionic.Platform.isAndroid() ) {
                ionic.Platform.platforms.push('chromeapp');
            }

            InitDashboardService.init();

            //todo: determine why this is needed ?
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    }])

  /*  .run(function ($rootScope, $state) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log('hello $stateChangeStart');
            console.log('content loaded: ',event);
            console.log(toState);
            console.log(toParams);
            //event.preventDefault();
            //if (toState.authenticate && !AuthService.isAuthenticated()){
            //    // User isn’t authenticated
            //    $state.transitionTo("login");
            //    event.preventDefault();
            //}
        });
    })*/

    .run(['$rootScope', '$state', '$stateParams', 'authorization', 'principal',
        function($rootScope, $state, $stateParams, authorization, principal) {
            $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
                // track the state the user wants to go to; authorization service needs this
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;
                // if the principal is resolved, do an authorization check immediately. otherwise,
                // it'll be done when the state it resolved.
                if (principal.isIdentityResolved()) authorization.authorize();
            });
        }
    ]);