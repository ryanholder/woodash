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

    .directive('ordersChart', function () {
        var url = "http://api.openweathermap.org/data/2.5/forecast/daily?mode=json&units=imperial&cnt=14&q=";
        return {
            restrict: 'E',
            scope: {
                city: '@'
            },
            replace: true,
            template: '<div style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
            controller: ['$scope', '$http', function($scope, $http) {
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
            }],
            link: function (scope, iElement, iAttrs) {
                scope.getTemp(iAttrs.city);
                scope.$watch('weather', function(newVal) {
                    // the `$watch` function will fire even if the
                    // weather property is undefined, so we'll
                    // check for it
                    if (newVal) {
                        var iData = [];

                        var iData = [{
                        "year": 2005,
                            "customers": 23,
                            "guests": 5
                    }, {
                        "year": 2006,
                            "customers": 27,
                            "guests": 4
                    }, {
                        "year": 2007,
                            "customers": 33,
                            "guests": 8
                    }, {
                        "year": 2008,
                            "customers": 27,
                            "guests": 4
                    }, {
                        "year": 2009,
                            "customers": 33,
                            "guests": 8
                    }, {
                        "year": 2010,
                            "customers": 27,
                            "guests": 4
                    }];

//                        angular.forEach(scope.weather, function(value){
//                            iData.push({
//                                date: value.dt,
//                                temp: value.temp.max
//                            });
//                        });

                        console.table(iData);
                        initChart(iElement, iAttrs, iData);
                    }
                });
//                var iData = "";


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