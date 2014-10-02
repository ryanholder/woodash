'use strict';

/* Controllers */

angular.module('woodash.controllers', [])

	.controller('AppCtrl', function () {

	})

    .controller('SiteCtrl', function () {

    })

    .controller('DashboardCtrl', ['$scope', 'initDashboard', '$ionicModal', function ($scope, initDashboard, $ionicModal) {
        this.googleConnected = initDashboard.googleAuth.isAuthenticated;
        this.dropboxConnected = initDashboard.dropboxAuth.isAuthenticated;

        $ionicModal.fromTemplateUrl('templates/modals/dashboard.cloud.connect.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.modal = modal;
            modal.show();
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

        if (!this.googleConnected && !this.dropboxConnected) {
            //perform the modal popup/welcome with request to connect to one of the services
            console.log('we need to connect to a service');
            //$scope.modal.show();
        }
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