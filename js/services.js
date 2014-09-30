'use strict';

angular.module('woodash.services', [])

    .factory('wcOrders', function(Restangular) {
        return Restangular.service('orders');
    })

    .factory('LoadingService', function($rootScope, $ionicLoading) {
        var LoadingService = {};

        LoadingService.show = function () {
            $ionicLoading.show({
                noBackdrop: true
            });
        };

        LoadingService.hide = function () {
            $ionicLoading.hide();
        };

        return LoadingService;
    })

    .factory('InitAppService', function($q, StoreDetailsService, LoadingService) {
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