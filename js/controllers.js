'use strict';

/* Controllers */

angular.module('woodash.controllers', [])

	.controller('AppCtrl', ['$rootScope','$scope', '$ionicPopover', '$ionicModal', '$ionicSideMenuDelegate', 'GoogleAuthService', function ($rootScope, $scope, $ionicPopover, $ionicModal, $ionicSideMenuDelegate, GoogleAuthService) {

        // todo: local storage items should not be collected each time AppCtril is run
        chrome.storage.local.get('google_auth', function(storage) {
            $scope.cloudConnectList = [
                { id: 'google_auth', text: "Google Drive", checked: storage.google_auth.isAuthenticated }
            ];
        });

        $scope.siteConnect = function(site) {
            // todo: function to check we are connected, dummy for now
            var AppSitesService = function (site) {
                console.log('we connected yay!!');
                site.connected = true;
                return site;
            };

            AppSitesService(site);

            if (site.connected) {
                chrome.storage.local.set({'app_site': site}, function() {
                    $rootScope.appSites = site;
                });
            }

            console.log(site);
        };

        $scope.cloudConnectChange = function(cloud) {
            if (cloud.id == 'google_auth' && !cloud.checked) {
                GoogleAuthService.revokeToken();
            }
        };

/*        $scope.collapsedMenuChange = function(setting) {
            chrome.storage.local.set({'app_general_settings': {
                collapsed_menu: setting
            }});
        };*/

        $ionicModal.fromTemplateUrl('templates/modals/app.settings.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
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

	.controller('OverviewCtrl', ['$scope', 'initOverview', function ($scope, initOverview) {
        this.orders = initOverview.orders;
        this.dateRange = initOverview.dateRange;

        console.log(this.dateRange);
        console.log(this.orders);
	}])

    .controller('CustomersCtrl', ['$scope', function ($scope) {

    }])

    .controller('ProductsCtrl', ['$scope', function ($scope) {

    }])

    .controller('OrdersCtrl', ['$scope', function ($scope) {

    }]);