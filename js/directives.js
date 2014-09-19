'use strict';

/* Directives */

angular.module('woodash.directives', [])

	.directive('appVersion', ['version', function (version) {
		return function (scope, elm, attrs) {
			elm.text(version);
		};
	}])

    .directive('dateRange', function () {
        return {
            restrict: "EA",
            replace: true,
            template: [
                '<div class="pull-right">',
                    '<i class="fa fa-calendar fa-lg"></i><span>{{dateRange.startDateFormated}}{{dateRange.separator}}{{dateRange.endDateFormated}}</span><b class="caret"></b>',
                '</div>'
            ].join(''),
            controller: function($scope){
                //todo: the current dateRange object should be a service that could be injected in to other directives
                $scope.dateRange = {
                    startDate: moment().startOf('day'),
                    endDate: moment().endOf('day'),
                    startDateFormated: moment().startOf('day').format('ll'),
                    endDateFormated: moment().endOf('day').format('ll'),
                    minDate: false,
                    maxDate: false,
                    dateLimit: { days: 60 },
                    showDropdowns: false,
                    showWeekNumbers: false,
                    timePicker: false,
                    timePickerIncrement: 30,
                    timePicker12Hour: true,
                    singleDatePicker: false,
                    ranges: {
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                    },
                    opens: 'left',
                    buttonClasses: ['btn btn-default'],
                    applyClass: 'btn-small btn-primary',
                    cancelClass: 'btn-small',
                    format: 'DD/MM/YYYY',
                    separator: ' - ',
                    locale: {
                        applyLabel: 'Apply',
                        cancelLabel: 'Cancel',
                        fromLabel: 'From',
                        toLabel: 'To',
                        customRangeLabel: 'Custom Range',
                        daysOfWeek: moment.weekdaysMin(),
                        monthNames: moment.monthsShort(),
                        firstDay: moment.localeData()._week.dow
                    }
                };

                $scope.cb = function(start, end, label) {
                    $scope.$apply(function ($scope) {
                        $scope.dateRange.startDate = start;
                        $scope.dateRange.endDate = end;
                        $scope.dateRange.startDateFormated = start.format('ll');
                        $scope.dateRange.endDateFormated = end.format('ll');
                    });
                };
            },
            link: function(scope, element, attrs) {
                var el = $(element);
                el.daterangepicker(scope.dateRange, scope.cb);
            }
        };
    })

    .directive('ordersChart', function (wcOrders) {
        return {
            require: 'ngModel',
            restrict: 'E',
            replace: true,
            transclude: false,
            template: '<div style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
            controller: ['$scope', function ($scope) {
                //not using controller but this may be incorrect ??
            }],
            link: function (scope, element, attrs, ngModel) {
                scope.getOrders = function (val) {
                    var params = {
                        "filter[created_at_min]": val.startDate.toISOString(),
                        "filter[created_at_max]": val.endDate.toISOString(),
                        "status": "completed"
                    };

                    wcOrders.getList(params).then(function(orders) {
                        var allOrders = [];

                        angular.forEach(orders, function(value) {
                            value.moment_date = moment(value.created_at).format('YYYY-MM-DD');
                            allOrders.push(value);
                        });

                        initChart(element, attrs, allOrders);
                    })
                };

                scope.$watchCollection(attrs.ngModel, function (val) {
                    if (val) {
                        scope.getOrders(val);
                    }
                });//end watch
            }
        }
    })

    .directive('totalRevenue', function () {
        return {
            require: 'ngModel',
            restrict: 'EA',
            replace: true,
            template: [
                '<div>',
                    '<div class="card">',
                        '<div class="woodash-numbers-main">$32,000</div>',
                        '<div class="woodash-numbers-desc"><i class="fa fa-arrow-circle-up"></i>total revenue</div>',
                    '</div>',
                '</div>'
            ].join(''),
            controller: ['$scope', function ($scope) {
                //todo
                console.log($scope);
            }],
            link: function (scope, element, attrs, controller) {
                //todo
                console.log(attrs);
            }
        }
    });

/*    .directive('chartWidget', function (wcOrders) { // chartWidget to be a more generic version of above ordersWidget
        return {
            require: 'ngModel',
            restrict: 'E',
            replace: true,
            transclude: false,
            template: '<div style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
            controller: ['$scope', function ($scope) {
                //not using controller but this may be incorrect ??
            }],
            link: function (scope, element, attrs, ngModel) {
                scope.getOrders = function (val) {
                    var params = {
                        "filter[created_at_min]": val.dateFrom,
                        "filter[created_at_max]": val.dateTo,
                        "status": "completed"
                    };

                    wcOrders.getList(params).then(function(orders) {
                        var allOrders = [];

                        angular.forEach(orders, function(value) {
                            value.moment_date = moment(value.created_at).format('YYYY-MM-DD');
                            allOrders.push(value);
                        });

                        initChart(element, attrs, allOrders);
                    })
                };

                scope.$watch(attrs.ngModel, function (val) {
                    if (val) {
                        scope.getOrders(val);
                    }
                });//end watch
            }
        }
    });*/

    var initChart = function(element, attrs, data) {
//        console.log(data);
        c3.generate({
            bindto: element[0],
            data: {
                json: data,
                keys: {
                    x: 'moment_date',
                    value: ['total', 'subtotal']
                }
            },
            axis: {
                x: {
                    type: 'timeseries'
                }
            }
        });
    };