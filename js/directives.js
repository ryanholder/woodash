'use strict';

/* Directives */

angular.module('woodash.directives', [])

	.directive('appVersion', ['version', function (version) {
		return function (scope, elm, attrs) {
			elm.text(version);
		};
	}])

//    .directive('woodashPieChart', function () {
//        return {
//            restrict: 'EA',
//            template: '<div class="sparkline"></div>'
//        }
//    })

//.directive('ngSparkline', function() {
//        var url = "http://api.openweathermap.org/data/2.5/forecast/daily?mode=json&units=imperial&cnt=14&q=";
//        return {
//            restrict: 'A',
//            require: '^ngCity',
//            transclude: true,
////            replace: true,
//            scope: {
//                ngCity: '@'
//            },
//            template: '<div class="sparkline" style="min-width: 310px; height: 400px; margin: 0 auto"><div ng-transclude></div></div>',
//            controller: ['$scope', '$http', function($scope, $http) {
//                $scope.getTemp = function(city) {
//                    $http({
//                        method: 'GET',
//                        url: url + city
//                    }).success(function(data) {
//                        var weather = [];
//                        angular.forEach(data.list, function(value){
//                            weather.push(value);
//                        });
//                        $scope.weather = weather;
//                    });
//                }
//            }],
//            link: function(scope, iElement, iAttrs, ctrl) {
//                scope.getTemp(iAttrs.ngCity);
//                scope.$watch('weather', function(newVal) {
//                    // the `$watch` function will fire even if the
//                    // weather property is undefined, so we'll
//                    // check for it
//                    if (newVal) {
//                        var highs = [];
//
//                        angular.forEach(scope.weather, function(value){
//                            highs.push({
//                                date: value.dt,
//                                temp: value.temp.max
//                            });
//                        });
//
//                        chartGraph(iElement, highs, iAttrs);
//                    }
//                });
//            }
//        }
//})

    .directive('ngCity', function() {
        return {
            controller: function($scope) {}
        }
    })

.directive("valueDisplay1", function () {
    return {
        restrict: "E",
        link: function (scope, element, attrs) {
            element.text(scope[attrs.value]);
        }
    };
})



.directive("valueDisplay3", function () {
    return {
        restrict: "E",
        link: function (scope, element, attrs) {
            attrs.$observe("value", function (newValue) {
                element.text(newValue);
            });
        }
    };
})

.directive("valueDisplay4", function () {
    return {
        restrict: "E",
        scope: {
            value: "="
        },
        template: '{{value}}'
    };
})

.directive("valueDisplay5", function () {
    return {
        restrict: "E",
        scope: {
            value: "@"
        },
        template: '{{value}}'
    };
})

    .directive("valueDisplay2", function () {

        return {
            restrict: "E",
            link: function (scope, element, attrs) {
                scope.$watch(attrs.value, function(newValue) {
                    element.text(newValue);
                });
            }
        };

    })

    .directive('ordersChart', function () {
//        var url = "http://api.openweathermap.org/data/2.5/forecast/daily?mode=json&units=imperial&cnt=14&q=";
        return {
            restrict: 'E',
//            template: '<div style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
/*            controller: ['$scope', '$http', 'Restangular', function ($scope, $http, Restangular) {

                var allOrders = Restangular.all('orders');

                // This will query /orders and return a promise.
                allOrders.getList().then( function(accounts) {
                    $scope.allAccounts = accounts;
                    var firstAccount = accounts[0];
                    console.log(accounts);
                    console.log(firstAccount);


                    $scope.accountFromServer = firstAccount.get();
                });

                $scope.getTemp = function(city) {
                    $http({
                        method: 'GET',
                        url: url + city
                    }).success(function(data) {
                        var weather = [];
                        angular.forEach(data.list, function(value){
                            weather.push(value);
                        });
                        $scope.weather = weather;
                    });
                }
            }],*/
            link: function (scope, element, attrs) {
                scope.$watch(attrs.daval, function(newValue) {
                    element.text(newValue);
                });

         /*       console.log(scope.start);
                console.log(scope.end);

                scope.$watch('start', function(newValue, oldValue) {
                    if (newValue)
                        console.log("I see a data change!");
                }, true);*/
/*                function updateTime() {
                    console.log(iAttrs);
                }

                scope.$watch(iAttrs.start, function(value) {
                    if (value) {
                        console.log('hello:' + value);
                        updateTime();
                    }
                });*/



            }//end watch
        }
    });


    var initChart = function(element, attrs, data) {

        AmCharts.makeChart(attrs.id, {
            "type": "serial",
            "dataProvider": data,
            color: "#646464",
            categoryField: "year",
            rotate: false,
            //  autoMargins: false,
            // autoMarginOffset: 15,
            // autoMargins: false,
            // marginBottom: 20,
            // marginLeft: 0,
            // marginRight: 0,
            // marginTop: 10,
            columnWidth: 0.6,

            categoryAxis: {
                gridPosition: "start",
                axisColor: "#DADADA",
                gridThickness: 0,
                axisThickness: 0,
                // fillAlpha: 0.2,
                // fillColor: "#cccccc"
            },
            valueAxes: [{
                axisAlpha: 0,
                gridColor: "#ccc",
                gridAlpha: 0.2,
                stackType: "regular",
                // fillAlpha: 0.55,
                // fillColor: "#ff0000"
                // fillColor: "#f6f6f7",
                // minVerticalGap: 50,
                // ignoreAxisWidth: true,
                // inside: true,
                // totalText: "[[total]]",
            }],
            legend: {
                align: "right",
                position: "top",
                useGraphSettings: true
            },
            balloon: {
                borderThickness: 0,
                color: "#FFFFFF",
                fillColor: "#000000",
                shadowAlpha: 0
            },
            graphs: [{
                type: "column",
                title: "Customers",
                valueField: "customers",
                lineAlpha: 0,
                fillColors: "#3995d4",
                fillAlphas: 0.9,
                balloonText: "[[title]] in [[category]]:<b>[[value]]</b>"
            }, {
                type: "column",
                title: "Guests",
                valueField: "guests",
                lineAlpha: 0,
                fillColors: "#65b7f1",
                fillAlphas: 0.9,
                balloonText: "[[title]] in [[category]]:<b>[[value]]</b>"
            }]
        });


    };