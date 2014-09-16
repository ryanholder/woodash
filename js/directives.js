'use strict';

/* Directives */

angular.module('woodash.directives', [])

	.directive('appVersion', ['version', function (version) {
		return function (scope, elm, attrs) {
			elm.text(version);
		};
	}])

    .directive('bsdrpDatepicker', function ($parse) {
        return {
            restrict: "E",
            replace: true,
            transclude: false,
            compile: function (element, attrs) {
                var modelAccessor = $parse(attrs.ngModel);

                var html = "<div id='" + attrs.id + "' class='pull-right'>" +
                    "<i class='fa fa-calendar fa-lg'></i><span></span><b class='caret'></b></div>";

                var newElem = $(html);
                element.replaceWith(newElem);

                return function (scope, element, attrs, controller) {

                    scope.dateRange = {
                        dateFrom: moment.utc().subtract(6, 'month').toJSON(),
                        dateTo: moment.utc().toJSON()
                    }

                    var el = $(element);

                    el.daterangepicker(
                        {
                            ranges: {
                                'Today': [moment.utc(), moment.utc()],
                                'Yesterday': [moment.utc().subtract(1, 'days'), moment.utc().subtract(1, 'days')],
                                'Last 7 Days': [moment.utc().subtract(6, 'days'), moment.utc()],
                                'Last 30 Days': [moment.utc().subtract(29, 'days'), moment.utc()],
                                'This Month': [moment.utc().startOf('month'), moment.utc().endOf('month')],
                                'Last Month': [moment.utc().subtract(1, 'month').startOf('month'), moment.utc().subtract(1, 'month').endOf('month')]
                            },
                            startDate: moment.utc().subtract(6, 'month'),
                            endDate: moment.utc()
                        },
                        function(start, end) {
                            var dateRange = {
                                dateFrom: start.toJSON(),
                                dateTo: end.toJSON()
                            }

                            scope.$apply(function (scope) {
                                modelAccessor.assign(scope, dateRange);
                            });
                        }
                    );

                    scope.$watch(modelAccessor, function (val) {
                        el.children('span').html(moment(val.dateFrom).format('MMMM D, YYYY') + ' - ' + moment(val.dateTo).format('MMMM D, YYYY'));
                    });
                };
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
    });

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