'use strict';

angular.module('woodash.services', [])

    .factory('wcOrders', function(Restangular) {
        return Restangular.service('orders');
    })

    .factory('InitDashboardService', function($q, LoadingService, GoogleAuthService, DropboxAuthService) {
        LoadingService.show();

        //client.authenticate({ interactive: false }, updateAuthenticationStatus);
        var googleAuth = GoogleAuthService.getToken({ interactive: false });
        var dropboxAuth = DropboxAuthService.getToken({ interactive: false });

        return $q.all([googleAuth, dropboxAuth]).then(function(results){
            LoadingService.hide();

            return {
                googleAuth: results[0],
                dropboxAuth: results[1]
            };
        });

        //console.dir(googleAuth);
        //console.dir(dropboxAuth);

        //console.log('true');
        /*GoogleAuthService.getToken(false).then(function(user) {
            if (!user.isAuthenticated) {
                $state.go('app.overview');
            }

                $state.go('app.overview');
            });*/
        //console.log(authenticated);

        //if (GoogleAuthService.getToken(true) === false) {
        //    console.log('we need them to connect');
        //}

        //var storeDetails = StoreDetailsService.getDetails();
        //
        //return $q.all([storeDetails]).then(function(results){

            //LoadingService.hide();

            //return {
            //    storeDetails: results[0]
            //};
        //});
    })

    .factory('LoadingService', function($rootScope, $ionicLoading) {
        var LoadingService = {};

        LoadingService.show = function () {
            $ionicLoading.show({
                //noBackdrop: true
            });
        };

        LoadingService.hide = function () {
            $ionicLoading.hide();
        };

        return LoadingService;
    })

    .factory('GoogleAuthService', function($q, Restangular) {
        var GoogleAuthService = {};

        GoogleAuthService.getToken = function (interactive, opt_callback) {
            var deferred = $q.defer();

            deferred.notify('Checking for Google Drive Authentication');

            chrome.identity.getAuthToken(interactive, function(token) {
                if (chrome.runtime.lastError) {
                    deferred.notify('Not currently authenticated to Google Drive');
                    deferred.resolve({
                        isAuthenticated: false,
                        errorMessage: chrome.runtime.lastError
                    });
                } else {
                    deferred.notify('Found the authenticated Google Drive account');
                    deferred.resolve({
                        isAuthenticated: true,
                        accessToken: token
                    });
                }

                GoogleAuthService.accessToken = token;

                opt_callback && opt_callback();
            });

            deferred.notify('Finished looking for authenticated Google Drive account');

            return deferred.promise;
        };

        GoogleAuthService.removeCachedToken = function (opt_callback) {
            if (GoogleAuthService.accessToken) {
                var accessToken = GoogleAuthService.accessToken;
                GoogleAuthService.accessToken = null;

                chrome.identity.removeCachedAuthToken({token: accessToken}, function() {
                    opt_callback && opt_callback();
                });
            } else {
                opt_callback && opt_callback();
            }
        };

        GoogleAuthService.revokeToken = function (opt_callback) {
            if (GoogleAuthService.accessToken) {
                // Make a request to revoke token
                var revokeToken = Restangular.customGET('https://accounts.google.com/o/oauth2/revoke', {token: GoogleAuthService.accessToken});
                revokeToken.then(function(response) {
                    console.log(response);
                    GoogleAuthService.removeCachedToken(opt_callback);
                });
            }
        };

        return GoogleAuthService;
    })

    .factory('DropboxAuthService', function($q, Restangular) {
        var DropboxAuthService = {};

        // todo: can this be moved to angular service/provider or similar ?
        var dropbox = new Dropbox.Client({key: 'p287k5sblifqcoc'});

        DropboxAuthService.getToken = function (interactive, opt_callback) {

            var deferred = $q.defer();

            deferred.notify('Checking for Dropbox Authentication');

            dropbox.authenticate(interactive, function(error, client) {
                if (!client.isAuthenticated()) {
                    deferred.notify('Not currently authenticated to Dropbox');
                    deferred.resolve({
                        isAuthenticated: false,
                        errorMessage: error
                    });
                } else {
                    deferred.notify('Found the authenticated Dropbox account');
                    deferred.resolve({
                        isAuthenticated: true,
                        dropboxClient: client
                    });
                }

                DropboxAuthService.dropboxClient = client;

                opt_callback && opt_callback();
            });

            deferred.notify('Finished looking for authenticated Dropbox account');

            return deferred.promise;
        };

        DropboxAuthService.removeCachedToken = function (opt_callback) {
            if (DropboxAuthService.accessToken) {
                var accessToken = DropboxAuthService.accessToken;
                DropboxAuthService.accessToken = null;

                chrome.identity.removeCachedAuthToken({token: accessToken}, function() {
                    opt_callback && opt_callback();
                });
            } else {
                opt_callback && opt_callback();
            }
        };

        DropboxAuthService.revokeToken = function (opt_callback) {
            if (DropboxAuthService.accessToken) {
                // Make a request to revoke token
                var revokeToken = Restangular.customGET('https://accounts.google.com/o/oauth2/revoke', {token: DropboxAuthService.accessToken});
                revokeToken.then(function(response) {
                    console.log(response);
                    DropboxAuthService.removeCachedToken(opt_callback);
                });
            }
        };

        return DropboxAuthService;
    })

    .factory('InitAppService', function($q, LoadingService, StoreDetailsService) {
        LoadingService.show();

        var storeDetails = StoreDetailsService.getDetails();

        return $q.all([storeDetails]).then(function(results){

            LoadingService.hide();

            return {
                storeDetails: results[0]
            };
        });
    })

    .factory('InitOverviewService', function(DateRangeService, OrdersService, $q) {
        //var InitOverviewService = {};


        //InitOverviewService.loadOverview = function () {
            var dateRange = DateRangeService.initRange();
            var orders = OrdersService.getOrders();

            return $q.all([dateRange, orders]).then(function(results){
                return {
                    dateRange: results[0],
                    orders: results[1]
                };
                //return {
                //    dateRange: results[0],
                //    orders: results[1]
                //};
            });
        //};


        //return InitOverviewService;
/*        return function() {


            return $q.all([dateRange, orders]).then(function(results){
                return {
                    dateRange: results[0],
                    orders: results[1]
                };
            });
        }*/
    })

    .factory('OrdersService', ['$q', 'Restangular', 'NotificationService', function($q, Restangular, NotificationService) {
        var OrdersService = {};

        OrdersService.getOrders = function () {
            var deferred = $q.defer();
            Restangular.all('orders').getList().then(
                function(data) {
                    deferred.resolve({
                        orders: data
                    });
                },
                function(error) {
                    NotificationService.showError(error);
                });
            return deferred.promise;
        };

        return OrdersService;
     }])

    .factory('DateRangeService', function() {
        var DateRangeService = {};

        DateRangeService.initRange = function () {
            var dateRange = {
                startDate: moment().startOf('month'),
                endDate: moment().endOf('month')
            };

            return dateRange;
        };

        DateRangeService.getRange = function () {
            return dateRange;
        };

        DateRangeService.setRange = function (start, end) {
            var dateRange = {
                startDate: start,
                endDate: end
            };

            return dateRange;
        };

        return DateRangeService;
    })

    .factory('StoreDetailsService', function($q, Restangular, NotificationService) {
        var StoreDetailsService = {};

        StoreDetailsService.getDetails = function () {
            var deferred = $q.defer();
            Restangular.all('').getList().then(
                function(data) {
                    deferred.resolve({
                        storeDetails: data
                    });
                },
                function(error) {
                    NotificationService.showError(error);
                });
            return deferred.promise;
        };

        StoreDetailsService.setDetails = function () {
            // Service to update the store settings
        };

        return StoreDetailsService;
    })

    .factory('NotificationService', ['$q', function($q) {
        var NotificationService = {};

        NotificationService.showError = function (reason) {
            NotificationService.error = reason;
        };

        return NotificationService;
    }])


    .factory('xhrIdentityAuth', function () {
        return {
            getToken: function () {
                chrome.identity.getAuthToken({ 'interactive': false }, function (token) {
                    if (chrome.runtime.lastError) {
                        console.log(chrome.runtime.lastError);
                        //				changeState(STATE_START);
                    } else {
                        console.log('Token acquired:' + token);
                        //				changeState(STATE_AUTHTOKEN_ACQUIRED);
                    }
                });
            },
            revokeToken: function () {
                chrome.identity.getAuthToken({ 'interactive': false }, function (current_token) {
                    if (!chrome.runtime.lastError) {
                        // @corecode_begin removeAndRevokeAuthToken
                        // @corecode_begin removeCachedAuthToken
                        // Remove the local cached token
                        chrome.identity.removeCachedAuthToken({ token: current_token }, function () {});
                        // @corecode_end removeCachedAuthToken
                        // Make a request to revoke token in the server
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' + current_token);
                        xhr.send();
                        // @corecode_end removeAndRevokeAuthToken
                        // Update the user interface accordingly
//							changeState(STATE_START);
                        console.log('Token revoked and removed from cache. ' +
                            'Check chrome://identity-internals to confirm.');
                    }
                });
            },
            currentToken: function () {
                chrome.identity.getAuthToken({ 'interactive': false }, function (current_token) {
                    if (chrome.runtime.lastError) {
                        console.log(current_token);
                    }
                });
            }
        }
    })

    // Simple value service.
    .value('version', '0.1');