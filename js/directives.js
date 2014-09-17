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
                console.log(modelAccessor);
                console.log(attrs.ngModel);

                var html = "<div id='" + attrs.id + "' class='pull-right'>" +
                    "<i class='fa fa-calendar fa-lg'></i><span></span><b class='caret'></b></div>";

                var newElem = $(html);
                element.replaceWith(newElem);

                return function (scope, element, attrs, controller) {

                    scope.dateRange = {
                        dateFrom: moment.utc().subtract(6, 'month').toJSON(),
                        dateTo: moment.utc().toJSON()
                    };

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
                            };

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
                    //console.log(start, end, label);
                    //console.log(start.toISOString(), end.toISOString(), label);

                    //console.log($scope.dateRange);
                    //$scopedateRange = {
                    //    dateFrom: start.toJSON(),
                    //    dateTo: end.toJSON()
                    //};

                    $scope.$apply(function ($scope) {
                        $scope.dateRange.startDate = start;
                        $scope.dateRange.endDate = end;
                        $scope.dateRange.startDateFormated = start.format('ll');
                        $scope.dateRange.endDateFormated = end.format('ll');
                    });

                    //$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                    //alert("Callback has fired: [" + start.format('MMMM D, YYYY') + " to " + end.format('MMMM D, YYYY') + ", label = " + label + "]");
                };

                //$scope.dateRange = {
                //    dateFrom: moment.utc().subtract(6, 'month').toJSON(),
                //    dateTo: moment.utc().toJSON()
                //};

            },
            link: function(scope, element, attrs) {
                var el = $(element);

                //console.log(scope);
                el.daterangepicker(scope.dateRange, scope.cb);
                //    {
                //        ranges: {
                //            'Today': [moment.utc(), moment.utc()],
                //            'Yesterday': [moment.utc().subtract(1, 'days'), moment.utc().subtract(1, 'days')],
                //            'Last 7 Days': [moment.utc().subtract(6, 'days'), moment.utc()],
                //            'Last 30 Days': [moment.utc().subtract(29, 'days'), moment.utc()],
                //            'This Month': [moment.utc().startOf('month'), moment.utc().endOf('month')],
                //            'Last Month': [moment.utc().subtract(1, 'month').startOf('month'), moment.utc().subtract(1, 'month').endOf('month')]
                //        },
                //        startDate: moment.utc().subtract(6, 'month'),
                //        endDate: moment.utc()
                //    },
                //    function(start, end) {
                //
                //    }
                //);

                // Use the relatively new watchCollection().
                //scope.$watchCollection("dateRange", function( newValue, oldValue ) {
                //    //console.log( newValue, oldValue );
                //    //el.children('span').html(moment(newValue.startDate).format('MMMM D, YYYY') + ' - ' + moment(newValue.endDate).format('MMMM D, YYYY'));
                //});
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
                    //var params2 = {
                    //    "filter[created_at_min]": val.dateFrom,
                    //    "filter[created_at_max]": val.dateTo,
                    //    "status": "completed"
                    //};

                    var params = {
                        "filter[created_at_min]": val.startDate.toISOString(),
                        "filter[created_at_max]": val.endDate.toISOString(),
                        "status": "completed"
                    };

                    //console.log(val, params, params2);

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

    .directive('valueWidget', function () {
        return {
            //require: 'ngModel',
            restrict: 'EA',
            replace: true,
            scope: {
                service: '@',
                function: '@'
            },
            templateUrl: '/templates/value-widget.directive.html',
            controller: ['$scope', function ($scope) {
                //todo
                console.log($scope.service);
            }],
            link: function (scope, element, attrs, controller) {
                //todo
                console.log(attrs.service);
            }
        }
    })

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