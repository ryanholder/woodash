'use strict';

/* Controllers */

angular.module('woodash.controllers', [])

	.controller('AppCtrl', ['$scope', function ($scope) {

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

    .controller('DashboardCtrl', ['$rootScope', '$scope', '$ionicModal', '$ionicLoading', 'GoogleAuthService', function ($rootScope, $scope, $ionicModal, $ionicLoading, GoogleAuthService) {
        $scope.revokeGoogle = function() {
            GoogleAuthService.revokeToken();
        };

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