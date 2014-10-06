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

    .config(function ($compileProvider, $stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl as login'
            })

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu/app.html",
                controller: 'AppCtrl as app',
                resolves: {

                },
                onEnter: function(){
                    console.log('hello onEnter');
                }

            })

            .state('app.dashboard', {
                url: "/dashboard",
                views: {
                    'menuContent': {
                        templateUrl: "templates/dashboard.html",
                        controller: 'DashboardCtrl as dashboard'
                    }
                }
            })

            .state('app.overview', {
                url: "/overview",
                views: {
                    'menuContent': {
                        templateUrl: "templates/overview.html",
                        controller: 'OverviewCtrl as overview'
                    }
                }
            })

            .state('app.customers', {
                url: "/customers",
                views: {
                    'menuContent': {
                        templateUrl: "templates/customers.html",
                        controller: 'CustomersCtrl as customers'
                    }
                }
            })

            .state('app.products', {
                url: "/products",
                views: {
                    'menuContent': {
                        templateUrl: "templates/products.html",
                        controller: 'ProductsCtrl as products'
                    }
                }
            })

            .state('app.orders', {
                url: "/orders",
                views: {
                    'menuContent': {
                        templateUrl: "templates/orders.html",
                        controller: 'OrdersCtrl as orders'
                    }
                }
            });

        $urlRouterProvider.otherwise("/app/dashboard");

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

            //InitDashboardService.init();
            //$state.go('app.dashboard');

            //todo: determine why this is needed ?
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    }])

  /*  .run(function ($rootScope, $state, CloudAuthService) {


        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (toState.data.authenticate && CloudAuthService.isAuthenticated()) {
                console.log('test');
            }
        });
    })*/

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

    .run(['$rootScope', '$state', '$stateParams', '$q', 'authorization', 'GoogleAuthService', 'DropboxAuthService', function($rootScope, $state, $stateParams, $q, authorization, GoogleAuthService, DropboxAuthService) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams) {
            //track the state the user wants to go to; authorization service needs this
            if(toState.name.indexOf('app') !== -1 ) {
                event.preventDefault();
                console.log('im app');
                //console.log(toState);
                //console.log(toStateParams);

                var googleAuth = GoogleAuthService.getToken({ interactive: false });
                var dropboxAuth = DropboxAuthService.getToken({ interactive: false });

                $q.all([googleAuth, dropboxAuth]).then(function(results){
                    var cloudConnect = {
                        googleAuth: results[0],
                        dropboxAuth: results[1]
                    };

                    console.dir(cloudConnect);
                    //
                    if (!cloudConnect.googleAuth.isAuthenticated && !cloudConnect.dropboxAuth.isAuthenticated) {
                        //event.preventDefault();
                        //    $ionicLoading.hide();
                        //

                        $state.go('login');
                        //
                        //
                        //} else {
                        //    determine if we have 1 or more sites setup, more than 1 we go to app.dashboard, only 1 we go to site.[id].overview
                        //$state.go('app.console.dashboard');
                    } else {
                        console.log(event);
                        console.log(toState);
                        console.log(toStateParams);
                        //$state.reload();
                        //$state.go(toState.name, result.params, {notify: false});
                        //$state.go(toState.name, toStateParams, { reload: false });
                        //$state.transitionTo(toState.name);
                        $state.go(toState.name, toStateParams, {notify: false}).then(function() {
                            // line 907 state.js
                            $rootScope.$broadcast('$stateChangeSuccess', toState, toStateParams, fromState, fromStateParams);
                        });
                        //$state.transitionTo(toState.name, toStateParams, {resume: true});
                        //$state.go(toState.name,{notify: false});
                    }



                });

                //CloudAuthService.isAuthenticated();
            }

        });
    }]);