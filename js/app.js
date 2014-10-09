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

    .config(function ($urlRouterProvider) {

        // Prevent $urlRouter from automatically intercepting URL changes;
        // this allows you to configure custom behavior in between
        // location changes and route synchronization:
        $urlRouterProvider.deferIntercept();

    })

    .run(['$rootScope', '$state', '$ionicPlatform', function ($rootScope, $state, $ionicPlatform) {
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

    .run(function($rootScope, $urlRouter, $ionicLoading, GoogleAuthService, HelloWorld) {
        $rootScope.$on('$locationChangeSuccess', function(evt) {

            console.log(evt);

            evt.preventDefault();

            GoogleAuthService.getToken({ interactive: true }).then(function(token) {
                // Once the user has logged in, sync the current URL
                // to the router:
                if (typeof token !== "undefined") {
                    $urlRouter.sync();
                }
            });

/*            GoogleAuthService.hasToken().then(function(token) {
                console.log('b');
                if (typeof token === "undefined") {

                    console.log('a');
                }

                console.log(token);


                console.log('c');
                $urlRouter.sync();
            });*/



            //HelloWorld.getMessages().then(function(messages) {
            //
            //        //$ionicLoading.show();
            //        //console.log('loading start');
            //        //GoogleAuthService.getToken({ interactive: true })
            //        //    .then(function(results) {
            //        //        console.log(results);
            //        //        if (results.isAuthenticated) {
            //        //            $ionicLoading.hide();
            //        //            console.log('loading stop');
            //        //        }
            //        //    });
            //
            //    console.log('a');
            //    console.log(messages);
            //    console.log('b');
            //
            //    console.log('c');
            //    $urlRouter.sync();
            //});




            //console.log(HelloWorld.getMessages());
            //var deferred = $q.defer();
            //var promise = deferred.promise.then(firstFn).then(secondFn).then(thirdFn, errorFn);
            //if (GoogleAuthService.hasToken()) return;
            //
            //// Halt state change from even starting
            //evt.preventDefault();
            //// Perform custom logic
            //
            ////var googleAuth = GoogleAuthService.getToken({ interactive: true });
            //
            ////var meetsRequirement = /* ... */
            //
            //console.log(evt);
            //console.log($q);
            //
            //GoogleAuthService.getToken({ interactive: true }).then(function() {
            //    // Once the user has logged in, sync the current URL
            //    // to the router:
            //
            //    $urlRouter.sync();
            //});
            // Continue with the update and state transition if logic allows
            //if (meetsRequirement) $urlRouter.sync();
        });
        $urlRouter.listen();
    });

 /*   .run(['$rootScope', '$state', '$q', 'GoogleAuthService', 'DropboxAuthService', function($rootScope, $state, $q, GoogleAuthService, DropboxAuthService) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams) {
            console.log('$stateChangeStart');
            if(toState.name.indexOf('app') !== -1 ) {
                event.preventDefault();

                var googleAuth = GoogleAuthService.getToken({ interactive: false });
                var dropboxAuth = DropboxAuthService.getToken({ interactive: false });

                $q.all([googleAuth, dropboxAuth]).then(function(results){
                    var cloudConnect = {
                        googleAuth: results[0],
                        dropboxAuth: results[1]
                    };

                    if (!cloudConnect.googleAuth.isAuthenticated && !cloudConnect.dropboxAuth.isAuthenticated) {
                        $state.go('login');
                    } else {
                        console.log(event);
                        console.log(toState);
                        console.log(toStateParams);
                        $state.go(toState.name, toStateParams, {notify: false}).then(function() {
                            $rootScope.$broadcast('$stateChangeSuccess', toState, toStateParams, fromState, fromStateParams);
                        });
                    }
                });
            }
        });
    }]);*/