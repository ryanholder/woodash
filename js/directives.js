'use strict';

/* Directives */

angular.module('woodash.directives', [])

	.directive('appVersion', ['version', function (version) {
		return function (scope, elm, attrs) {
			elm.text(version);
		};
	}])

    .directive('ngCity', function() {
        return {
            controller: function($scope) {}
        }
    })

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
                        console.dir(val);
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



            }],
            link: function (scope, element, attrs, ngModel) {

                scope.getOrders = function () {

                    var params = {
                        "filter[created_at_min]": attrs.ngModel.dateFrom,
                        "filter[created_at_max]": attrs.ngModel.dateTo
                    };

                    console.log(params);

                    wcOrders.getList(params).then(function(orders) {

                        var allOrders = [];

                        angular.forEach(orders, function(value, key) {
                            allOrders.push(value);
                        });

                        console.table(allOrders);
                        initChart(element, attrs, allOrders);
                    })
                };

                scope.$watch(attrs.ngModel, function (val) {
                    if (val) {
                        console.dir(val);
                        scope.getOrders();
                    }
                });

                console.log(scope);
                console.log(ngModel);
            }//end watch
        }
    });


    var initChart = function(element, attrs, data) {

//        console.table(data);
        AmCharts.makeChart(attrs.id, {
            "type": "serial",
            "dataProvider": data,
            color: "#646464",
            categoryField: "created_at",
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
                valueField: "total",
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