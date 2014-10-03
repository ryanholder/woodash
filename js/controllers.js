'use strict';

/* Controllers */

angular.module('woodash.controllers', [])

	.controller('AppCtrl', function () {

	})

    .controller('SiteCtrl', function () {

    })

    .controller('DashboardCtrl', ['$rootScope', '$scope', '$ionicModal', '$ionicLoading', function ($rootScope, $scope, $ionicModal, $ionicLoading) {

        console.log('hello dashboard');

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                console.log('hello $stateChangeStart');
                console.log('content loaded: ',event);
                //event.preventDefault();
                // transitionTo() promise will be rejected with
                // a 'transition prevented' error
            });

/*        $scope.$on('$viewContentLoaded', function(event){
            console.log('hello viewContentLoaded');
            // Access to all the view config properties.
            // and one special property 'targetView'
            // viewConfig.targetView
            console.log('content loaded: ',event)
        });*/

        /*$ionicModal.fromTemplateUrl('templates/modals/dashboard.cloud.connect.html', {
            scope: $rootScope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            //$scope.modal = modal;
            modal.show();
        });*/


     /*   $scope.openModal = function() {
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
        });*/


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