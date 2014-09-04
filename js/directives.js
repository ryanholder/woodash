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

    .directive('wooChart', function () {
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

//                        var iData = [{
//                            "year": "1950",
//                            "value": -0.307
//                        }, {
//                            "year": "1951",
//                            "value": -0.168
//                        }, {
//                            "year": "1952",
//                            "value": -0.073
//                        }, {
//                            "year": "1953",
//                            "value": -0.027
//                        }, {
//                            "year": "1954",
//                            "value": -0.251
//                        }, {
//                            "year": "2005",
//                            "value": 0.47
//                        }];

                        angular.forEach(scope.weather, function(value){
                            iData.push({
                                date: value.dt,
                                temp: value.temp.max
                            });
                        });

                        console.table(iData);
                        initChart(iElement, iAttrs, iData);
                    }
                });
//                var iData = "";


            }//end watch
        }
    });


var initChart = function(element, attrs, data) {

    var chart = AmCharts.makeChart(attrs.id, {
        "type": "serial",
        "theme": "none",
        "marginLeft": 20,
        "pathToImages": "http://www.amcharts.com/lib/3/images/",
        "dataProvider": data,
        "valueAxes": [{
            "axisAlpha": 0,
            "inside": true,
            "position": "left",
            "ignoreAxisWidth": true
        }],
        "graphs": [{
            "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
            "bullet": "round",
            "bulletSize": 6,
            "lineColor": "#d1655d",
            "lineThickness": 2,
            "negativeLineColor": "#637bb6",
            "type": "smoothedLine",
            "valueField": "temp"
        }],
        "chartScrollbar": {},
        "chartCursor": {
            "categoryBalloonDateFormat": "YYYY",
            "cursorAlpha": 0,
            "cursorPosition": "mouse"
        },
//        "dataDateFormat": "DD",
        "categoryField": "date",
        "categoryAxis": {
            "minPeriod": "hh",
            "parseDates": true,
            "minorGridAlpha": 0.1,
            "minorGridEnabled": true
        }
    });


};