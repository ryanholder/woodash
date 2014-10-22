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

    .controller('CustomersCtrl', ['$scope', function ($scope) {

    }])

    .controller('ProductsCtrl', ['$scope', function ($scope) {

    }])

    .controller('OrdersCtrl', ['$scope', function ($scope) {

    }]);