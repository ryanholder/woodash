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


    .constant('appSiteConfig', {
        'site_url': 'https://wp.thewhatwhat.com/wc-api/v2',
        'consumer_key': 'ck_45841d89825d617a00814f88e74face7',
        'consumer_secret': 'cs_d6da0b74e1f26cdd1f6bb6c8a0207e90',
        'connected': false
    })

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
                resolve: {
                    appData: function(WooComDataService) {
                        return WooComDataService.loadData([
                            'store'
                        ]);
                    }
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
                },
                resolve: {
                    stateData: function(WooComDataService) {
                        return WooComDataService.loadData([
                            'customers',
                            'orders'
                        ]);
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
                },
                resolve: {
                    stateData: function(WooComDataService) {
                        return WooComDataService.loadData([
                            'customers'
                        ]);
                    }
                }
            })

            .state('app.customers.detail', {
                url: "/detail/{id}",
                views: {
                    '@app.customers': {
                        templateUrl: "templates/customers.detail.html",
                        controller: 'CustomersDetailCtrl as customersdetail'
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
                },
                resolve: {
                    stateData: function(WooComDataService) {
                        return WooComDataService.loadData([
                            'products'
                        ]);
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
                },
                resolve: {
                    stateData: function(WooComDataService) {
                        return WooComDataService.loadData([
                            'orders'
                        ]);
                    }
                }
            });

        $urlRouterProvider.otherwise("/app/overview");
    })

    .config(function(appSiteConfig, RestangularProvider) {
        RestangularProvider.setBaseUrl(appSiteConfig.site_url);
        RestangularProvider.setDefaultRequestParams({
            consumer_key: appSiteConfig.consumer_key,
            consumer_secret: appSiteConfig.consumer_secret
        });

        // todo: add a response intereceptor
        // todo: require due to "Response for getList SHOULD be an array and not an object or something else..."
        RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
            var extractedData;

            // .. to look for getList operations
            if (operation === "getList") {
                // .. and handle the data and meta data
                if (what === '') {
                    // todo: should I be converting returned data to array or leave as object
                    extractedData = _.toArray(data);
                } else {
                    extractedData = data[what];
                }
            }

            return extractedData;
        });
    })

    .run(['$rootScope', '$state', '$ionicPlatform', function ($rootScope, $state, $ionicPlatform) {
        $ionicPlatform.ready(function () {
            if ( !ionic.Platform.isIPad() || !ionic.Platform.isAndroid() ) {
                ionic.Platform.platforms.push('chromeapp');
            }

            // todo: should be moved some provider or service
            chrome.storage.local.get('app_site', function(sites) {
                if (_.isEmpty(sites) || _.isUndefined(sites)) {
                    var appSites = {
                        site_url: 'https://wp.thewhatwhat.com/wc-api/v2',
                        consumer_key: 'ck_45841d89825d617a00814f88e74face7',
                        consumer_secret: 'cs_d6da0b74e1f26cdd1f6bb6c8a0207e90',
                        connected: true
                    };
                    chrome.storage.local.set({'app_site': appSites}, function() {
                        $rootScope.appSites = appSites;
                    });
                } else {
                    $rootScope.appSites = sites.app_site;
                }
            });

            // todo: should be using single object for entire app in local storage
            // todo: should also consider moving to factory and call on route resolves
            // todo: prevent general settings being set till better side menu solution in place
/*
            chrome.storage.local.get('app_general_settings', function(settings) {
                if (_.isEmpty(settings)) {
                    var appGeneralSettings = {
                        collapsed_menu: {
                            text: 'Collapsed Menu',
                            checked: false
                        }
                    };
                    chrome.storage.local.set({'app_general_settings': appGeneralSettings}, function() {
                        $rootScope.collapsedMenu = appGeneralSettings.collapsed_menu ;
                    });
                } else {
                    $rootScope.collapsedMenu = settings.app_general_settings.collapsed_menu;
                }
            });
*/

            //todo: determine why this is needed ?
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    }]);

    // todo: there must be a better way to handle if we are connected to google or dropbox
    // todo: look in to using https://github.com/sahat/satellizer, jwt.io
    // todo: the being connected to cloud service should appear as modal also use google identity listerner for change
 /*   .run(['$rootScope', '$state', '$q', 'GoogleAuthService', 'DropboxAuthService', function($rootScope, $state, $q, GoogleAuthService, DropboxAuthService) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams) {
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
                        $rootScope.$viewHistory.currentView = $rootScope.$viewHistory.backView;
                        $rootScope.$viewHistory.backView = null;
                        //console.log($rootScope);
                        //console.log($state);
                        $state.go(toState.name, toStateParams, {notify: false}).then(function() {
                            $rootScope.$broadcast('$stateChangeSuccess', toState, toStateParams, fromState, fromStateParams);
                        });
                    }
                });
            }
        });
    }]);*/