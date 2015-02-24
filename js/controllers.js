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

    .controller('CustomersCtrl', ['$scope', '$http', 'stateData', '$ionicViewSwitcher', '$ionicHistory', function ($scope, $http, stateData, $ionicViewSwitcher, $ionicHistory) {
        var customers = this;

        //todo: This clearHistory function might be heavy as an onclick, look to perform check on state change.
        customers.clearHistory = function () {
            //$ionicViewSwitcher.nextTransition('none');
            $ionicHistory.clearHistory();
            //$ionicHistory.clearCache();
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
        };

        $scope.detailView.display = true;

        //todo: move to services
        angular.forEach(stateData.customers, function(value, key) {
            var customerResource = stateData.customers[key];

            //todo: switch to using restangular
            $http.get(value.avatar_url, {responseType: 'blob'}).success(function(blob, status, headers, config) {
                value.avatar_url_blob = window.URL.createObjectURL(blob);
            });

            customerResource.orders = customerResource.getList('orders');

        });

        customers.list = stateData.customers;

        customers.drawOpen = false;
        customers.toggleDrawer = function () {
            customers.drawOpen = !customers.drawOpen;
        };
    }])

    .controller('CustomersDetailCtrl', ['$rootScope', '$scope', '$stateParams', '$state', function ($rootScope, $scope, $stateParams, $state) {
        var customersdetail = this;

        angular.forEach($scope.customers.list, function(value, key) {
            if (value.id === $stateParams.id) {
                return customersdetail.info = $scope.customers.list[key];
            }
        });

        console.log(customersdetail.info.plain());

        customersdetail.info.orders.then( function (orders) {
            if (orders.length > 0) {
                customersdetail.orders = orders.plain();
            }
        });
    }])

    .controller('CustomersOrderCtrl', ['$scope', '$stateParams', '$state', 'stateData', function ($scope, $stateParams, $state, stateData) {
        var customersorder = this;

/*        angular.forEach(stateData.customers, function(value, key) {
            if (value.id === $stateParams.id) {
                return customersorder.info = stateData.customers[key];
            }
        });

        if (typeof customersorder.info.orders !== 'undefined') {
            customersorder.orders = customersorder.info.orders.plain();
        }

        console.log(customersorder.orders);*/
    }])

    .controller('ProductsCtrl', ['$scope', '$http', 'stateData', function ($scope, $http, stateData) {
        var products = this;

        $scope.detailView.display = true;

        products.list = stateData.products;

        //todo: move to services
        angular.forEach(stateData.products, function(value, key) {
            var productResource = stateData.products[key];

            //todo: switch to using restangular

            /*            productResource.getList('products').then( function (products) {
             if (products.length > 0) {
             productResource.products = products;
             }
             });*/
        });
    }])

    .controller('ProductsDetailCtrl', ['$scope', '$stateParams', '$state', 'stateData', 'firstProduct', function ($scope, $stateParams, $state, stateData, firstProduct) {
        var productsdetail = this;

        angular.forEach(stateData.products, function(value, key) {
            if (value.id === $stateParams.id) {
                return productsdetail.info = stateData.products[key];
            }
        });

        if (typeof productsdetail.info.products !== 'undefined') {
            productsdetail.products = productsdetail.info.products.plain();
        }

        console.log(productsdetail.products);

        //console.log(productsdetail.products);
    }])

    .controller('OrdersCtrl', ['$scope', '$http', 'stateData', function ($scope, $http, stateData) {
        var orders = this;

        $scope.detailView.display = true;

        orders.list = stateData.orders;

        //todo: move to services
        angular.forEach(stateData.orders, function(value, key) {
            var orderResource = stateData.orders[key];

            //todo: switch to using restangular

/*            orderResource.getList('orders').then( function (orders) {
                if (orders.length > 0) {
                    orderResource.orders = orders;
                }
            });*/
        });
    }])

    .controller('OrdersDetailCtrl', ['$scope', '$stateParams', '$state', 'stateData', 'firstOrder', function ($scope, $stateParams, $state, stateData, firstOrder) {
        var ordersdetail = this;

        angular.forEach(stateData.orders, function(value, key) {
            if (value.id === $stateParams.id) {
                return ordersdetail.info = stateData.orders[key];
            }
        });

        if (typeof ordersdetail.info.orders !== 'undefined') {
            ordersdetail.orders = ordersdetail.info.orders.plain();
        }

        console.log(ordersdetail.orders);

        //console.log(ordersdetail.orders);
    }])

    .controller('PlayboxCtrl', ['$scope', function ($scope) {
        var playbox = this;
    }]);