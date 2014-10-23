'use strict';

/* Controllers */

angular.module('woodash.controllers', [])

	.controller('AppCtrl', ['$rootScope','$scope', '$ionicPopover', '$ionicModal', '$ionicSideMenuDelegate', 'GoogleAuthService', 'wcApiStoreData', function ($rootScope, $scope, $ionicPopover, $ionicModal, $ionicSideMenuDelegate, GoogleAuthService, wcApiStoreData) {

        var app = this;

        console.dir(wcApiStoreData);

        app.wcApiStoreData = wcApiStoreData;
        app.siteName = wcApiStoreData.name;
        chrome.storage.local.get('app_site', function(site) {
            site = site.app_site;
            site.store = wcApiStoreData;
            chrome.storage.local.set({'app_site': site});
        });

        // todo: local storage items should not be collected each time AppCtrl is run
        chrome.storage.local.get('google_auth', function(storage) {
            $scope.cloudConnectList = [
                { id: 'google_auth', text: "Google Drive", checked: storage.google_auth.isAuthenticated }
            ];
        });

        $scope.siteConnectList = $rootScope.appSites;

        $scope.siteConnect = function(site) {
            // todo: function to check we are connected, dummy for now
            var AppSitesService = function (site) {
                site.connected = true;
                return site;
            };

            AppSitesService(site);

            if (site.connected) {
                chrome.storage.local.set({'app_site': site}, function() {
                    $rootScope.appSites = site.app_site;
                });
            }
        };

        $scope.cloudConnectChange = function(cloud) {
            if (cloud.id == 'google_auth' && !cloud.checked) {
                GoogleAuthService.revokeToken();
            }
        };

        $ionicModal.fromTemplateUrl('templates/modals/app.settings.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            app.settingsModal = modal;
        });

        $ionicModal.fromTemplateUrl('templates/modals/woocommerce.store.settings.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            app.wcStoreSettingsModal = modal;
        });


	}])

    .controller('LoginCtrl', ['$scope', '$state', '$stateParams', 'GoogleAuthService', 'DropboxAuthService', '$ionicLoading', function ($scope, $state, $stateParams, GoogleAuthService, DropboxAuthService, $ionicLoading) {
        console.log($state);
        console.log($stateParams);

        $scope.loginGoogle = function() {
            $ionicLoading.show();
            console.log('loading start');
            GoogleAuthService.getToken({ interactive: true })
                .then(function(results) {
                    console.log(results);
                    if (results.isAuthenticated) {
                        $ionicLoading.hide();
                        console.log('loading stop');
                        $state.go('app.dashboard');
                    }

                });
        };

        $scope.loginDropbox = function() {
            $ionicLoading.show();
            DropboxAuthService.getToken({ interactive: true })
                .then(function(results) {
                    console.log(results);
                    if (results.isAuthenticated) {
                        $ionicLoading.hide();
                        console.log('loading stop');
                        $state.go('app.dashboard');
                    }
                });
        }

    }])

    .controller('DashboardCtrl', ['$rootScope', '$scope', '$ionicModal', '$ionicLoading', function ($rootScope, $scope, $ionicModal, $ionicLoading) {
        console.log('hello dashboard');
    }])

	.controller('OverviewCtrl', ['$scope', function ($scope) {
        //this.orders = initOverview.orders;
        //this.dateRange = initOverview.dateRange;

        //console.log(this.dateRange);
        //console.log(this.orders);
	}])

    .controller('CustomersCtrl', ['$scope', '$http', 'wcCustomers', function ($scope, $http, wcCustomers) {
        //var customers = this;

        var params = {
            "filter[limit]": 99
        };



        $scope.getCustomerImage = function(url) {
            //console.log(url);
            $http.get(url, {responseType: 'blob'}).success(function(blob, status, headers, config) {

                console.log(blob, status, headers, config);

                //blob.name = doc.iconFilename; // Add icon filename to blob.

                //writeFile(blob); // Write is async, but that's ok.

                var localImage = window.URL.createObjectURL(blob);
                //return localImage;

                //dataset.avatar_url_local = localImage;
                //$scope.docs.push(doc);

                // Only sort when last entry is seen.
                //if (totalEntries - 1 == i) {
                //    $scope.docs.sort(Util.sortByDate);
                //}
            });

            //return url;
        };

        wcCustomers.getList(params).then(function(results) {
            console.log(results);

            $scope.list = results;

            //for (var i = results.length - 1; i >= 0; i--) {
            //    $scope.list.push(results.plain()[i]);
            //    var dataset = results[i];
            //    var remoteImage = dataset.avatar_url;

                //var xhr = new XMLHttpRequest();
                //xhr.open('GET', remoteImage, true);
                //xhr.responseType = 'blob';
                //xhr.onload = function(e) {
                    //var img = document.createElement('img');
                    //console.log(window.URL.createObjectURL(this.response));
                    //dataset.avatar_url = window.URL.createObjectURL(this.response);
                    //document.body.appendChild(img);
                //};

                //xhr.send();

                //remoteImage = new RAL.RemoteImage(dataset.avatar_url);
                //RAL.Queue.add(remoteImage);
                //remoteImage.addEventListener('loaded', function(remoteImage) {
                //    console.log(remoteImage);
                //});
                //if (dataset.window && dataset.window === 'lifetime') {
                //    delete dataset.window;
                //    retObj = dataset;
                //    break;
                //}
                //console.log($scope.list);
            //}
            //RAL.Queue.setMaxConnections(4);
            //RAL.Queue.start();
            $scope.list.forEach(function(record) {
                $http.get(record.avatar_url, {responseType: 'blob'}).success(function(blob, status, headers, config) {

                    console.log(blob, status, headers, config);

                    record.avatar_url = window.URL.createObjectURL(blob);
                    //blob.name = doc.iconFilename; // Add icon filename to blob.

                    //writeFile(blob); // Write is async, but that's ok.

                    //var localImage = window.URL.createObjectURL(blob);
                    //return localImage;

                    //dataset.avatar_url_local = localImage;
                    //$scope.docs.push(doc);

                    // Only sort when last entry is seen.
                    //if (totalEntries - 1 == i) {
                    //    $scope.docs.sort(Util.sortByDate);
                    //}
                });
                console.log(record);
            });
        })




    }])

    .controller('ProductsCtrl', ['$scope', function ($scope) {

    }])

    .controller('OrdersCtrl', ['$scope', function ($scope) {

    }]);