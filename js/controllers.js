'use strict';

/* Controllers */

angular.module('woodash.controllers', [])

	.controller('AppCtrl', ['$scope', '$ionicLoading', 'xhrIdentityAuth', function ($scope, $ionicLoading, xhrIdentityAuth) {
		//want to make sure user information is displayed
		var xhr_button, revoke_button;

		function xhrWithAuth(method, url, interactive, callback) {
			var access_token;

			var retry = true;

			getToken();

			function getToken() {
				chrome.identity.getAuthToken({ interactive: interactive }, function (token) {
					if (chrome.runtime.lastError) {
						callback(chrome.runtime.lastError);
						return;
					}

					access_token = token;
					requestStart();
				});
			}

			function requestStart() {
				var xhr = new XMLHttpRequest();
				xhr.open(method, url);
				xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
				xhr.onload = requestComplete;
				xhr.send();
			}

			function requestComplete() {
				if (this.status == 401 && retry) {
					retry = false;
					chrome.identity.removeCachedAuthToken({ token: access_token },
						getToken);
				} else {
					callback(null, this.status, this.response);
				}
			}
		}

		function getUserInfo(interactive) {
			xhrWithAuth('GET',
				'https://www.googleapis.com/plus/v1/people/me',
				interactive,
				onUserInfoFetched);
		}

		// Code updating the user interface, when the user information has been
		// fetched or displaying the error.
		function onUserInfoFetched(error, status, response) {
			if (!error && status == 200) {
//				changeState(STATE_AUTHTOKEN_ACQUIRED);
//				sampleSupport.log(response);
				var user_info = JSON.parse(response);
				populateUserInfo(user_info);
			} else {
//				changeState(STATE_START);
			}
		}

		function populateUserInfo(user_info) {
			// TODO: Not the right place to do this, perhaps a service to retrieve value
			var user_info_div = document.querySelector('#user_info');

			var email = user_info['emails'].filter(function (v) {
				return v.type === 'account'; // Filter out the primary email
			})[0].value;

			user_info_div.innerHTML = "<span>" + user_info.displayName + "</span>";
			fetchImageBytes(user_info);
		}

		function fetchImageBytes(user_info) {
			if (!user_info || !user_info.image || !user_info.image.url) return;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', user_info.image.url, true);
			xhr.responseType = 'blob';
			xhr.onload = onImageFetched;
			xhr.send();
		}

		function onImageFetched(e) {
			// TODO: Not the right place to do this, perhaps a service to retrieve value
			var user_info_div = document.querySelector('#user_info');
			if (this.status != 200) return;
			var imgElem = document.createElement('img');
			var objUrl = window.webkitURL.createObjectURL(this.response);
			imgElem.src = objUrl;
			imgElem.onload = function () {
				window.webkitURL.revokeObjectURL(objUrl);
			};
//			user_info_div.insertAdjacentElement("afterbegin", imgElem);
		}

		getUserInfo();
	}])

	.controller('DashboardCtrl', ['$scope', '$ionicLoading', function ($scope, $ionicLoading) {


	}])

	.controller('OverviewCtrl', ['$scope', '$ionicLoading', function ($scope, $ionicLoading) {


	}])

	.controller('UppCtrl', ['$scope', '$ionicModal', function ($scope, $ionicModal) {
		var chart, chart2;
		var chartData = [];
		var chartData2 = [];

		// generate some random data
		function generateChartData() {

			var firstDate = new Date();
			firstDate.setDate(firstDate.getHours() - 1);

			for (var i = 0; i < 60; i++) {
				var newDate = new Date(firstDate);
				newDate.setDate(newDate.getMinutes() + i);

//				var g1 = Math.round(Math.random() * 40) + 100;
				var g2 = Math.random() * (2 - 0.5) + 0.5;

				chartData.push({
					date: newDate,
					g2: g2
				});
			}
		}

		function generateChartData2() {

			var firstDate = new Date();
			firstDate.setDate(firstDate.getHours() - 1);

			for (var i = 0; i < 60; i++) {
				var newDate = new Date(firstDate);
				newDate.setDate(newDate.getMinutes() + i);

//				var g1 = Math.round(Math.random() * 40) + 100;
				var g2 = Math.random() * (2 - 0.5) + 0.5;

				chartData2.push({
					date: newDate,
					g2: g2
				});
			}
		}

		// create chart
//		AmCharts.ready(function() {
		// generate some random data first
		generateChartData();
		generateChartData2();

		// SERIAL CHART
		chart = new AmCharts.AmSerialChart();
//		chart.marginTop = 0;
//		chart.autoMarginOffset = 5;
//		chart.pathToImages = "http://www.amcharts.com/lib/images/";
		chart.zoomOutButton = {
			backgroundColor: '#000000',
			backgroundAlpha: 0.15
		};
		chart.dataProvider = chartData;
		chart.categoryField = "date";
//		chart.autoMargins = false;
//		chart.marginTop = 0;
//		chart.marginRight = 0;
//		chart.marginLeft = 0;
//		chart.marginBottom = 0;
//		chart.equalSpacing = true;
//		chart.inside = true;

		// AXES
		// category
		var categoryAxis = chart.categoryAxis;
		categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
		categoryAxis.minPeriod = "mm"; // our data is daily, so we set minPeriod to DD
		categoryAxis.dashLength = 0;
		categoryAxis.gridAlpha = 0;
		categoryAxis.axisAlpha = 0;
		categoryAxis.axisColor = "#DADADA";
		categoryAxis.startOnAxis = true;
//		categoryAxis.period = "nn";
//		categoryAxis.format = "JJ:NN";
//		categoryAxis.position = "top";
		categoryAxis.color = "#bbbbbb";

		// value axis
		var valueAxis = new AmCharts.ValueAxis();
		valueAxis.axisColor = "#DADADA";
		valueAxis.axisThickness = 1;
		valueAxis.gridAlpha = 0.15;
		valueAxis.gridColor = "#DADADA";
		valueAxis.axisAlpha = 0;
//		valueAxis.inside = true;
		valueAxis.color = "#bbbbbb";
		chart.addValueAxis(valueAxis);

				// SERIAL CHART 2
		chart2 = new AmCharts.AmSerialChart();
//		chart2.marginTop = 0;
//		chart2.autoMarginOffset = 5;
//		chart2.pathToImages = "http://www.amcharts.com/lib/images/";
		chart2.zoomOutButton = {
			backgroundColor: '#000000',
			backgroundAlpha: 0.15
		};
		chart2.dataProvider = chartData2;
		chart2.categoryField = "date";
//		chart2.autoMargins = false;
//		chart2.marginTop = 0;
//		chart2.marginRight = 0;
//		chart2.marginLeft = 0;
//		chart2.marginBottom = 0;
//		chart2.equalSpacing = true;
//		chart2.inside = true;

		// AXES
		// category
		var categoryAxis2 = chart2.categoryAxis;
		categoryAxis2.parseDates = true; // as our data is date-based, we set parseDates to true
		categoryAxis2.minPeriod = "mm"; // our data is daily, so we set minPeriod to DD
		categoryAxis2.dashLength = 0;
		categoryAxis2.gridAlpha = 0;
		categoryAxis2.axisAlpha = 0;
		categoryAxis2.axisColor = "#DADADA";
		categoryAxis2.startOnAxis = true;
//		categoryAxis2.period = "nn";
//		categoryAxis2.format = "JJ:NN";
//		categoryAxis2.position = "top";
		categoryAxis2.color = "#bbbbbb";

		// value axis
		var valueAxis2 = new AmCharts.ValueAxis();
		valueAxis2.axisColor = "#DADADA";
		valueAxis2.axisThickness = 1;
		valueAxis2.gridAlpha = 0.15;
		valueAxis2.gridColor = "#DADADA";
		valueAxis2.axisAlpha = 0;
//		valueAxis2.inside = true;
		valueAxis2.color = "#bbbbbb";
		chart2.addValueAxis(valueAxis);

		// GRAPHS
		// second graph
		var graph1 = new AmCharts.AmGraph();
		graph1.title = "yellow line";
		graph1.fillAlphas = 0.2;
//		graph1.fillToGraph = graph1; // this here we specify which graph object to fill to
		graph1.valueField = "g2";
		graph1.bullet = "square";
		graph1.hideBulletsCount = 30;
		graph1.type = "smoothedLine";
		chart2.addGraph(graph1);

		// second graph
		var graph2 = new AmCharts.AmGraph();
		graph2.title = "yellow line";
		graph2.fillAlphas = 0.2;
//		graph2.fillToGraph = graph1; // this here we specify which graph object to fill to
		graph2.valueField = "g2";
		graph2.bullet = "square";
		graph2.hideBulletsCount = 30;
		graph2.type = "smoothedLine";
		chart.addGraph(graph2);

		// CURSOR
//		var chartCursor = new AmCharts.ChartCursor();
//		chartCursor.cursorPosition = "mouse";
//		chart.addChartCursor(chartCursor);

		// SCROLLBAR
//		var chartScrollbar = new AmCharts.ChartScrollbar();
//		chart.addChartScrollbar(chartScrollbar);

		// LEGEND
//		var legend = new AmCharts.AmLegend();
//		legend.marginLeft = 110;
//		chart.addLegend(legend);

		// WRITE
		chart.write("chartdiv");
		chart2.write("chartdiv2");
//		});
		$ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


	}])

	.controller('IntroductionCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
	}])

	.controller('LoginCtrl', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
		var signin_button = document.querySelector('#signin');
		signin_button.addEventListener('click', interactiveSignIn);

		function interactiveSignIn() {
			chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError);
				} else {
					console.log('Token acquired:' + token +
						'. See chrome://identity-internals for details.');
					console.log($state);
					$state.go('app.dashboard');
				}
			});
		}
	}])

	.controller('LoadingCtrl', ['$scope', '$ionicLoading', function ($scope, $ionicLoading) {

		// Trigger the loading indicator
	//	$scope.show = function () {

		// Show the loading overlay and text
		$scope.loading = $ionicLoading.show({

			// The text to display in the loading indicator
			content: 'Loading',

			// The animation to use
			animation: 'fade-in',

			// Will a dark overlay or backdrop cover the entire view
			showBackdrop: true,

			// The maximum width of the loading indicator
			// Text will be wrapped if longer than maxWidth
			maxWidth: 200,

			// The delay in showing the indicator
			showDelay: 500
		});
	//	};

		// Hide the loading indicator
		$scope.hide = function () {
			$scope.loading.hide();
		};
	}]);