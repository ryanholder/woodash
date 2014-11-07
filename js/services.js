'use strict';

angular.module('woodash.services', [])

    .factory('wcOrders', function(Restangular) {
        return Restangular.service('orders');
    })

    .factory('wcCustomers', function(Restangular) {
        return Restangular.service('customers');
    })

    .factory('wcProducts', function(Restangular) {
        return Restangular.service('products');
    })




    .factory('WooCommDataService', function($rootScope, $q, $timeout, $ionicLoading, Restangular) {
        var WooCommDataService = {};

        //todo: default params go here and are merged with params in functions
        WooCommDataService.globalParams = {
            "filter[limit]": 99
        };

        WooCommDataService.loadData = function (endpoints) {
            var deferred = $q.defer();

            var params = _.merge(WooCommDataService.globalParams, {});

            var promises = {};

            $ionicLoading.show();

            for (var i=0, tot=endpoints.length; i < tot; i++) {
                var endpoint = (endpoints[i] === 'store') ? '' : endpoints[i];
                var promise =  Restangular.all(endpoint).getList(params).then(function(results) {
                    return results;
                });

                promises[endpoints[i]] = promise;
            }

            $q.all(promises).then(function(result) {
                $ionicLoading.hide();
                deferred.resolve(result);
            });

            return deferred.promise;
        };

        WooCommDataService.getFirstItem = function (data) {
            return data[0].id;
        };

        WooCommDataService.getStoreOld = function () {
            var deferred = $q.defer();

            chrome.storage.local.get('app_site', function(site) {
                site = site.app_site;

                if (site.store === undefined) {
                    Restangular.all('').getList().then(function(results) {
                        var plainResults = results.plain()[0];
                        console.log(plainResults);
                        deferred.resolve(plainResults);
                        site.store = plainResults;
                        chrome.storage.local.set({'app_site': site});
                    });
                } else {
                    deferred.resolve(site.store);
                }
            });

            return deferred.promise;
        };

        WooCommDataService.getStore = function () {
            var deferred = $q.defer();

            chrome.storage.local.get('app_site', function(site) {
                site = site.app_site;

                if (site.store === undefined) {
                    Restangular.all('').getList().then(function(results) {
                        var plainResults = results.plain()[0];
                        console.log(plainResults);
                        deferred.resolve(plainResults);
                        site.store = plainResults;
                        chrome.storage.local.set({'app_site': site});
                    });
                } else {
                    deferred.resolve(site.store);
                }
            });

            return deferred.promise;
        };

        WooCommDataService.getOrders = function () {
            var deferred = $q.defer();
            var params = {
                "filter[limit]": 99
            };

            Restangular.all('orders').getList(params).then(function(results) {
                deferred.resolve(results);
            });

            return deferred.promise;
        };

        WooCommDataService.getCustomers = function () {
            var deferred = $q.defer();
            var params = {
                "filter[limit]": 99
            };

            Restangular.all('customers').getList(params).then(function(results) {
                deferred.resolve(results);
            });

            return deferred.promise;
        };

        WooCommDataService.getProducts = function () {
            var deferred = $q.defer();
            var params = {
                "filter[limit]": 99
            };

            Restangular.all('products').getList(params).then(function(results) {
                console.log(results);
                deferred.resolve(results);
            });

            return deferred.promise;
        };

        return WooCommDataService;
    })




    .factory('InitDashboardService', function($rootScope, $q, $state, $ionicLoading, $ionicModal, GoogleAuthService, DropboxAuthService) {
        var InitDashboardService = {};

        InitDashboardService.init = function () {
            $ionicLoading.show();

            var googleAuth = GoogleAuthService.getToken({ interactive: false });
            var dropboxAuth = DropboxAuthService.getToken({ interactive: false });

            $q.all([googleAuth, dropboxAuth]).then(function(results){
                return {
                    googleAuth: results[0],
                    dropboxAuth: results[1]
                };

                //console.dir(cloudConnect);
                //
                if (!cloudConnect.googleAuth.isAuthenticated && !cloudConnect.dropboxAuth.isAuthenticated) {
                //    $ionicLoading.hide();
                //
                    $state.go('login');
                //
                //
                //} else {
                //    determine if we have 1 or more sites setup, more than 1 we go to app.dashboard, only 1 we go to site.[id].overview
                    //$state.go('app.console.dashboard');
                }



            });

        };

        return InitDashboardService;






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

            //$ionicLoading.hide();

            //return {
            //    storeDetails: results[0]
            //};
        //});
    })

    .factory('authorization', ['$rootScope', '$state', 'principal', function($rootScope, $state, principal) {
        return {
            authorize: function() {
                return principal.identity()
                    .then(function() {
                        var isAuthenticated = principal.isAuthenticated();

                        if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
                            if (isAuthenticated) $state.go('accessdenied'); // user is signed in but not authorized for desired state
                            else {
                                // user is not authenticated. stow the state they wanted before you
                                // send them to the signin state, so you can return them when you're done
                                $rootScope.returnToState = $rootScope.toState;
                                $rootScope.returnToStateParams = $rootScope.toStateParams;

                                // now, send them to the signin state so they can log in
                                $state.go('signin');
                            }
                        }
                    });
            }
        };
    }])

    .factory('CloudAuthService', ['$q', '$http', '$timeout', '$state', 'GoogleAuthService', 'DropboxAuthService', function($q, $http, $timeout, $state, GoogleAuthService, DropboxAuthService) {
        var CloudAuthService = {};

        CloudAuthService.isAuthenticated = function () {

            var googleAuth = GoogleAuthService.getToken({ interactive: false });
            var dropboxAuth = DropboxAuthService.getToken({ interactive: false });

            $q.all([googleAuth, dropboxAuth]).then(function(results){
                var cloudConnect = {
                    googleAuth: results[0],
                    dropboxAuth: results[1]
                };

                //console.dir(cloudConnect);

                if (!cloudConnect.googleAuth.isAuthenticated && !cloudConnect.dropboxAuth.isAuthenticated) {
                    $state.go('login');
                }


            });

        };

        return CloudAuthService;
    }])

    .factory('GoogleAuthService', function($q, Restangular) {
        var GoogleAuthService = {},
            _identity = {
                isAuthenticated: false,
                errorMessage: '',
                accessToken: undefined
            };

        GoogleAuthService.hasToken = function () {
            var deferred = $q.defer();

            chrome.identity.getAuthToken({ interactive: false }, function(token) {
                if (!chrome.runtime.lastError) {
                    GoogleAuthService.accessToken = token;
                    deferred.resolve(token);
                } else {
                    deferred.reject(token);
                }
            });

            return deferred.promise;
        };

        GoogleAuthService.getToken = function (interactive, opt_callback) {
            var deferred = $q.defer();

            deferred.notify('Checking for Google Drive Authentication');

            chrome.identity.getAuthToken(interactive, function(token) {
                if (chrome.runtime.lastError) {
                    deferred.notify('Not currently authenticated to Google Drive');
                    _identity = _.merge(_identity, {
                        isAuthenticated: false,
                        errorMessage: chrome.runtime.lastError
                    });
                    chrome.storage.local.set({'google_auth': _identity});
                    deferred.resolve(_identity);
                } else {
                    deferred.notify('Found the authenticated Google Drive account');
                    _identity = _.merge(_identity, {
                        isAuthenticated: true,
                        accessToken: token
                    });
                    chrome.storage.local.set({'google_auth': _identity});
                    deferred.resolve(_identity);
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
                chrome.storage.local.remove('google_auth');
                // Make a request to revoke token
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' + GoogleAuthService.accessToken);
                xhr.send();

                //Restangular.customGET('https://accounts.google.com/o/oauth2/revoke', {token: GoogleAuthService.accessToken}).then(function(response) {
                //    console.log(response);
                GoogleAuthService.removeCachedToken(opt_callback);
                //});
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

    .factory('authorization', ['$rootScope', '$state', 'principal', function($rootScope, $state, principal) {
        return {
            authorize: function() {
                return principal.identity()
                    .then(function() {
                        var isAuthenticated = principal.isAuthenticated();

                        if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
                            if (isAuthenticated) $state.go('accessdenied'); // user is signed in but not authorized for desired state
                            else {
                                // user is not authenticated. stow the state they wanted before you
                                // send them to the signin state, so you can return them when you're done
                                $rootScope.returnToState = $rootScope.toState;
                                $rootScope.returnToStateParams = $rootScope.toStateParams;

                                // now, send them to the signin state so they can log in
                                $state.go('signin');
                            }
                        }
                    });
            }
        };
    }])

    .factory('principal', ['$q', '$http', '$timeout', function($q, $http, $timeout) {
        var _identity = undefined,
            _authenticated = false;

        return {
            isIdentityResolved: function() {
                return angular.isDefined(_identity);
            },
            isAuthenticated: function() {
                return _authenticated;
            },
            isInRole: function(role) {
                if (!_authenticated || !_identity.roles) return false;

                return _identity.roles.indexOf(role) != -1;
            },
            isInAnyRole: function(roles) {
                if (!_authenticated || !_identity.roles) return false;

                for (var i = 0; i < roles.length; i++) {
                    if (this.isInRole(roles[i])) return true;
                }

                return false;
            },
            authenticate: function(identity) {
                _identity = identity;
                _authenticated = identity != null;
            },
            identity: function(force) {
                var deferred = $q.defer();

                if (force === true) _identity = undefined;

                // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
                if (angular.isDefined(_identity)) {
                    deferred.resolve(_identity);

                    return deferred.promise;
                }

                // otherwise, retrieve the identity data from the server, update the identity object, and then resolve.
                //                   $http.get('/svc/account/identity', { ignoreErrors: true })
                //                        .success(function(data) {
                //                            _identity = data;
                //                            _authenticated = true;
                //                            deferred.resolve(_identity);
                //                        })
                //                        .error(function () {
                //                            _identity = null;
                //                            _authenticated = false;
                //                            deferred.resolve(_identity);
                //                        });

                // for the sake of the demo, fake the lookup by using a timeout to create a valid
                // fake identity. in reality,  you'll want something more like the $http request
                // commented out above. in this example, we fake looking up to find the user is
                // not logged in
                var self = this;
                $timeout(function() {
                    self.authenticate(null);
                    deferred.resolve(_identity);
                }, 1000);

                return deferred.promise;
            }
        };
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


// Code for Google Auth and getting images todo: must be removed once Google auth service is complete

//want to make sure user information is displayed
/*
var xhr_button, revoke_button;

function xhrWithAuth(method, url, interactive, callback) {
    var access_token;

    var retry = true;

    getToken();

    function getToken() {
        chrome.identity.getAuthToken({ interactive: interactive }, function (token) {
            if (chrome.runtime.lastError) {
                callback(chrome.runtime.lastError);
                return;
            }

            access_token = token;
            requestStart();
        });
    }

    function requestStart() {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        xhr.onload = requestComplete;
        xhr.send();
    }

    function requestComplete() {
        if (this.status == 401 && retry) {
            retry = false;
            chrome.identity.removeCachedAuthToken({ token: access_token },
                getToken);
        } else {
            callback(null, this.status, this.response);
        }
    }
}

function getUserInfo(interactive) {
    xhrWithAuth('GET',
        'https://www.googleapis.com/plus/v1/people/me',
        interactive,
        onUserInfoFetched);
}

// Code updating the user interface, when the user information has been
// fetched or displaying the error.
function onUserInfoFetched(error, status, response) {
    if (!error && status == 200) {
//				changeState(STATE_AUTHTOKEN_ACQUIRED);
//				sampleSupport.log(response);
        var user_info = JSON.parse(response);
        populateUserInfo(user_info);
    } else {
//				changeState(STATE_START);
    }
}

function populateUserInfo(user_info) {
    // TODO: Not the right place to do this, perhaps a service to retrieve value
    var user_info_div = document.querySelector('#user_info');

    var email = user_info['emails'].filter(function (v) {
        return v.type === 'account'; // Filter out the primary email
    })[0].value;

    user_info_div.innerHTML = "<span>" + user_info.displayName + "</span>";
    fetchImageBytes(user_info);
}

function fetchImageBytes(user_info) {
    if (!user_info || !user_info.image || !user_info.image.url) return;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', user_info.image.url, true);
    xhr.responseType = 'blob';
    xhr.onload = onImageFetched;
    xhr.send();
}

function onImageFetched(e) {
    // TODO: Not the right place to do this, perhaps a service to retrieve value
    var user_info_div = document.querySelector('#user_info');
    if (this.status != 200) return;
    var imgElem = document.createElement('img');
    var objUrl = window.webkitURL.createObjectURL(this.response);
    imgElem.src = objUrl;
    imgElem.onload = function () {
        window.webkitURL.revokeObjectURL(objUrl);
    };
//			user_info_div.insertAdjacentElement("afterbegin", imgElem);
}

getUserInfo();*/



// dropbox datastore example code todo: remove once service above is complete

/*
$scope.go = function() {
    var datastoreManager = client.getDatastoreManager();
    datastoreManager.openDefaultDatastore(function (error, datastore) {
        if (error) {
            console.log('Error opening default datastore: ' + error);
        }

        // Now you have a datastore. The next few examples can be included here.
        var taskTable = datastore.getTable('tasks');
        taskTable.setResolutionRule('level', 'max');

        $scope.add = function() {
            var firstTask = taskTable.insert({
                taskname: 'Buy milk',
                completed: false,
                created: new Date()
            });

            console.log(firstTask);
        }

        $scope.edit = function() {
            var results = taskTable.query();

            var firstResult = results[0];

            firstResult.set('completed', true);

            console.log(firstResult);
        };
    });


};*/
