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
        var url = "http://api.openweathermap.org/data/2.5/forecast/daily?mode=json&units=imperial&cnt=14&callback=JSON_CALLBACK&q=";
        return {
            restrict: 'A',
            require: '^ngCity',
            scope: {
                ngCity: '@'
            },
            template: '<div class="sparkline"><h4>Weather for {{ngCity}}</h4><div class="graph"></div></div>',
            controller: ['$scope', '$http', function($scope, $http) {
                $scope.getTemp = function(city) {
                    $http({
                        method: 'GET',
                        url: url + city
                    }).success(function(data) {
                        console.log(data);
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
            }
        }
})

.directive('ngCity', function() {
    return {
        controller: function($scope) {}
    }
});