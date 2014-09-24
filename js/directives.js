'use strict';

/* Directives */

angular.module('woodash.directives', [])

	.directive('appVersion', ['version', function (version) {
		return function (scope, elm, attrs) {
			elm.text(version);
		};
	}])

    .directive('dateRange', function (DateRangeService) {
        return {
            restrict: 'EA',
            replace: true,
            template: [
                '<div class="pull-right">',
                    '<i class="fa fa-calendar fa-lg"></i><span>{{dateRangeOptions.startDateFormated}}{{dateRangeOptions.separator}}{{dateRangeOptions.endDateFormated}}</span><b class="caret"></b>',
                '</div>'
            ].join(''),
            controller: function($scope){
                //todo: the current dateRange object should be a service that could be injected in to other directives
                var dateRange = DateRangeService.initRange();

                $scope.dateRangeOptions = {
                    startDate: dateRange.startDate,
                    endDate : dateRange.endDate,
                    startDateFormated: dateRange.startDate.format('ll'),
                    endDateFormated: dateRange.endDate.format('ll'),
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
                    var dateRange = DateRangeService.setRange(start, end);
                    $scope.$apply(function ($scope) {
                        $scope.dateRangeOptions.startDate = dateRange.startDate;
                        $scope.dateRangeOptions.endDate = dateRange.endDate;
                        $scope.dateRangeOptions.startDateFormated = dateRange.startDate.format('ll');
                        $scope.dateRangeOptions.endDateFormated = dateRange.endDate.format('ll');
                    });


                };
            },
            link: function(scope, element, attrs) {
                var el = $(element);
                el.daterangepicker(scope.dateRangeOptions, scope.cb);
            }
        };
    })

    .directive('bestSellingProducts', function (wcOrders) {
        return {
            //require: 'ngModel',
            restrict: 'EA',
            replace: true,
            scope: true,
            template: '<div style="min-width: 100px; height: 300px;"></div>',
            controller: ['$scope', function ($scope) {
                //todo: certain functionality to move to controller
            }],
            link: function (scope, element, attrs) {

                scope.getOrders = function (val) {
                    var params = {
                        "filter[created_at_min]": val.startDate.toISOString(),
                        "filter[created_at_max]": val.endDate.toISOString(),
                        "status": "completed"
                    };

                    wcOrders.getList(params).then(function(orders) {

                        console.log(orders);
                        var allOrders = [];
                        var obj = {};
                        var keys = [];

                        var lineItems = _.chain(_.flatten(orders, 'line_items'))
                            .union()
                            .value();

                        var lineItemsCount = _.chain(lineItems)
                            .countBy("product_id")
                            .pairs()
                            .sortBy(1).reverse()
                            .first(5)
                            .value();

                        var charDC = new DataCollection(lineItems);

                        angular.forEach(lineItemsCount, function(value) {
                            console.log(value);

                            var lineItemsProduct = charDC.query()
                                .filter({product_id: Number(value[0])})
                                .limit(1)
                                .values();

                            obj[lineItemsProduct[0].name] = value[1];

                            keys.push(lineItemsProduct[0].name);
                        });

                        allOrders.push(obj);

                        initBestSellingProducts(element, attrs, allOrders, keys);
                    })
                };

                scope.$watchCollection(attrs.ngModel, function (val) {
                    if (val) {
                        scope.getOrders(val);
                    }
                });
            }
        }
    })

    .directive('ordersChart', function (wcOrders) {
        return {
            //require: 'ngModel',
            restrict: 'EA',
            replace: true,
            transclude: false,
            template: '<div style="min-width: 310px; height: 400px;"></div>',
            controller: ['$scope', function ($scope) {
                //todo: certain functionality to move to controller
            }],
            link: function (scope, element, attrs) {

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

                        initOrdersChart(element, attrs, allOrders);
                    })
                };

                scope.$watchCollection(attrs.ngModel, function (val) {
                    if (val) {
                        scope.getOrders(val);
                    }
                });
            }
        }
    })

    .directive('valueCards', function (wcOrders, $filter) {
        //todo: create value directive that has child directives to perform alternative functions eg. <value-widget><total-revenue>
        return {
            require: 'ngModel',
            restrict: 'EA',
            replace: true,
            template: [
                '<div class="row woodash-numbers">',
                    '<div class="col">',
                        '<div class="card">',
                            '<div class="woodash-numbers-main">{{ordersPlaced}}</div>',
                            '<div class="woodash-numbers-desc"></i>orders placed</div>',
                        '</div>',
                    '</div>',
                    '<div class="col">',
                        '<div class="card">',
                            '<div class="woodash-numbers-main">{{productsSold}}</div>',
                            '<div class="woodash-numbers-desc"></i>products sold</div>',
                        '</div>',
                    '</div>',
                    '<div class="col">',
                        '<div class="card">',
                            '<div class="woodash-numbers-main">{{totalRevenue | currency}}</div>',
                            '<div class="woodash-numbers-desc"></i>total revenue</div>',
                        '</div>',
                    '</div>',
                    '<div class="col">',
                        '<div class="card">',
                            '<div class="woodash-numbers-main">{{averageSale | currency}}</div>',
                            '<div class="woodash-numbers-desc"></i>average sale</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join(''),
            controller: ['$scope', function ($scope) {
                $scope.getTotalRevenue = function (val) {
                    var params = {
                        "filter[created_at_min]": val.startDate.toISOString(),
                        "filter[created_at_max]": val.endDate.toISOString(),
                        "status": "completed"
                    };

                    wcOrders.getList(params).then(function(orders) {
                        //var allOrders = [];

                        console.log(orders);
                        var charDC = new DataCollection(orders);
                        $scope.totalRevenue = charDC.query().sum('total');
                        $scope.ordersPlaced = $filter('number')(orders.length, 0);
                        $scope.productsSold = $filter('number')(charDC.query().sum('total_line_items_quantity'), 0);
                        $scope.averageSale = charDC.query().avg('total');

                    })
                };
            }],
            link: function (scope, element, attrs, controller) {
                scope.$watchCollection(attrs.ngModel, function (val) {
                    if (val) {
                        scope.getTotalRevenue(val);
                    }
                });//end watch
            }
        }
    });

var initOrdersChart = function(element, attrs, data) {
        console.log(data);
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

var initBestSellingProducts = function(element, attrs, data, keys) {
    c3.generate({
        bindto: element[0],
        data: {
            json: data,
            keys: {
                value: keys
            },
            type: 'donut'
        }
    });
};