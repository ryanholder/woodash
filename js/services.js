'use strict';

angular.module('woodash.services', [])

    .factory('wcOrders', function(Restangular) {
        return Restangular.service('orders');
    })

    .factory("InitOverviewService", function(DateRangeService, OrdersService, $q) {
        return function() {
            var dateRange = DateRangeService.dateRange;
            var orders = OrdersService.getOrders();

            return $q.all([dateRange, orders]).then(function(results){
                return {
                    dateRange: results[0],
                    orders: results[1]
                };
            });
        }
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

    .factory('DateRangeService', ['$q', 'NotificationService', function($q, NotificationService) {
        var DateRangeService = {};

        DateRangeService.dateRange = {
            startDate: moment().startOf('day'),
            endDate: moment().endOf('day')
        };

        return DateRangeService;
    }])

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

/* Services */
