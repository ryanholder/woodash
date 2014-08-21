'use strict';

/* Directives */

angular.module('woodash.directives', [])

	.directive('appVersion', ['version', function (version) {
		return function (scope, elm, attrs) {
			elm.text(version);
		};
	}])

    .directive('woodashPieChart', function () {
        return {
            restrict: 'EA',
            template: '<div class="sparkline"></div>'
        }
    })

.directive('ngSparkline', function() {
        var url = "http://api.openweathermap.org/data/2.5/forecast/daily?mode=json&units=imperial&cnt=14&q=";
        return {
            restrict: 'A',
            require: '^ngCity',
            transclude: true,
            scope: {
                ngCity: '@'
            },
            template: '<div class="sparkline"><div ng-transclude></div><div id="graph"></div></div>',
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
            link: function(scope, iElement, iAttrs, ctrl) {
                scope.getTemp(iAttrs.ngCity);
                scope.$watch('weather', function(newVal) {
                    // the `$watch` function will fire even if the
                    // weather property is undefined, so we'll
                    // check for it
                    if (newVal) {
                        var highs = [];

                        angular.forEach(scope.weather, function(value){
                            highs.push({
                                date: value.dt,
                                temp: value.temp.max
                            });
                        });

                        chartGraph(iElement, highs, iAttrs);
                    }
                });
            }
        }
})

.directive('ngCity', function() {
    return {
        controller: function($scope) {}
    }
});

var chartGraph = function(element, data, opts) {
    var width = opts.width || 200,
        height = opts.height || 80,
        padding = opts.padding || 30;

    console.log(data);
    console.log(element);

    var chart = new AmCharts.AmSerialChart();
    chart.dataProvider = data;
    chart.categoryField = "date";

    var graph = new AmCharts.AmGraph();
    graph.valueField = "temp";
    graph.type = "column";
    chart.addGraph(graph);

    chart.write(element[0]);
}