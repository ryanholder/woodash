'use strict';

/* Controllers */

angular.module('woodash.controllers', [])

	.controller('AppCtrl', ['$rootScope','$scope', '$ionicPopover', '$ionicModal', '$ionicSideMenuDelegate', 'GoogleAuthService', 'appData', function ($rootScope, $scope, $ionicPopover, $ionicModal, $ionicSideMenuDelegate, GoogleAuthService, appData) {

        var app = this;
        console.log(appData);
        //var storeData = appData[0].plain()[0];

        //app.siteName = storeData.name;


        // todo: local storage items should not be collected each time AppCtrl is run
        //chrome.storage.local.get('google_auth', function(storage) {
        //    $scope.cloudConnectList = [
        //        { id: 'google_auth', text: "Google Drive", checked: storage.google_auth.isAuthenticated }
        //    ];
        //});

        $scope.detailView = {display: false};

        $scope.siteConnectList = $rootScope.appSites;


        //$scope.cloudConnectChange = function(cloud) {
        //    if (cloud.id == 'google_auth' && !cloud.checked) {
        //        GoogleAuthService.revokeToken();
        //    }
        //};

        //$ionicModal.fromTemplateUrl('templates/modals/app.settings.html', {
        //    scope: $scope,
        //    animation: 'slide-in-up'
        //}).then(function(modal) {
        //    app.settingsModal = modal;
        //});
        //
        //$ionicModal.fromTemplateUrl('templates/modals/woocommerce.store.settings.html', {
        //    scope: $scope,
        //    animation: 'slide-in-up'
        //}).then(function(modal) {
        //    app.wcStoreSettingsModal = modal;
        //});


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

	.controller('OverviewCtrl', ['$scope', 'stateData', function ($scope, stateData) {
        //todo: whether we are in display/split screen view should be handled possibly in resolves
        //$scope.detailView.display = false;

        console.log(stateData);

        //this.orders = initOverview.orders;
        //this.dateRange = initOverview.dateRange;

        //console.log(this.dateRange);
        //console.log(this.orders);
	}])

    .controller('CustomersCtrl', ['$scope', '$http', 'stateData', function ($scope, $http, stateData) {
        var customers = this;

        $scope.detailView.display = true;

        //todo: move to services
        angular.forEach(stateData.customers, function(value, key) {
            //console.log(value);
            //console.log(key);
            $http.get(value.avatar_url, {responseType: 'blob'}).success(function(blob, status, headers, config) {
                value.avatar_url_blob = window.URL.createObjectURL(blob);
            });

            //value.avatar_url = "";
        });

        customers.list = stateData.customers;
        console.log(customers.list);
    }])

    .controller('CustomersDetailCtrl', ['$scope', '$stateParams', '$state', 'stateData', 'firstCustomer', function ($scope, $stateParams, $state, stateData, firstCustomer) {
        var customersdetail = this;

        angular.forEach(stateData.customers, function(value, key) {
            if (value.id === $stateParams.id) {
                var selectedCustomer = stateData.customers.plain()[key];
                console.log(selectedCustomer);
            }
        });

        customersdetail.id = $stateParams.id;
        //console.log(stateData);
        //$scope.detailView.display = true;
        //
        //if ( typeof $stateParams === 'undefined' ) {
        //    $state.go('app.customers.detail', {id: 4});
        //}
        //
        //$scope.customerId = $stateParams.id;
        //
        //console.log($stateParams);
    }])

    .controller('ProductsCtrl', ['$scope', 'stateData', function ($scope, stateData) {
        //$scope.detailView.display = false;
        console.log(stateData);
    }])

    .controller('OrdersCtrl', ['$scope', function ($scope) {
        //$scope.detailView.display = false;
    }]);