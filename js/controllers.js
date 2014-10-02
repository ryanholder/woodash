'use strict';

/* Controllers */

angular.module('woodash.controllers', [])

	.controller('AppCtrl', function () {

	})

    .controller('SiteCtrl', function () {

    })

    .controller('DashboardCtrl', ['$scope', 'initDashboard', function ($scope, initDashboard) {
        this.googleConnected = initDashboard.googleAuth.isAuthenticated;
        this.dropboxConnected = initDashboard.dropboxAuth.isAuthenticated;

        if (!this.googleConnected && !this.dropboxConnected) {
            //perform the modal popup/welcome with request to connect to one of the services
            console.log('we need to connect to a service');
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