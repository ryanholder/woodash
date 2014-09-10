'use strict';

/* Controllers */

angular.module('woodash.controllers', [])

	.controller('AppCtrl', ['$scope', '$ionicLoading', '$state', 'xhrIdentityAuth', function ($scope, $ionicLoading, $state, xhrIdentityAuth) {
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

	.controller('OverviewCtrl', ['$scope', 'wcApi', function ($scope, wcApi) {

        $scope.dateRange = {
            dateFrom: moment().subtract(29, 'days'),
            dateTo: moment()
        }

        wcApi.getOrders();

		AmCharts.makeChart("overviewpie1div", {
			type: "pie",
			balloonText: "<span style='font-size:12px'><b>[[value]]</b> ([[percents]]%)</span>",
			innerRadius: "65%",
			labelRadius: 6,
			labelText: "[[title]]",
			minRadius: 80,
			pullOutRadius: 6,
			radius: "30%",
			startRadius: "100%",
			marginBottom: 0,
			marginLeft: 0,
			marginRight: 0,
			marginTop: 0,
			maxLabelWidth: 80,
			pullOutOnlyOne: true,
			sequencedAnimation: false,
			color: "#646464",
			colors: [
				"#3995d4",
				"#37B751",
				"#FD3A07",
				"#37ACC0",
				"#FD6E13",
				"#B0DE09",
			],
			// labelsEnabled: false,
			labelTickAlpha: 0.5,
			outlineAlpha: 1,
			outlineThickness: 2,
			titleField: "category",
			valueField: "column-1",
			allLabels: [],
			balloon: {
				fixedPosition: true,
				borderThickness: 0,
				color: "#FFFFFF",
				fillColor: "#000000",
				shadowAlpha: 0
			},

			titles: [],
			dataProvider: [{
				"category": "Mens red and white tshirt",
				"column-1": "10"
			}, {
				"category": "Product 2",
				"column-1": "9"
			}, {
				"category": "Mens red and black tshirt",
				"column-1": "4"
			}, {
				"category": "Product 4",
				"column-1": "4"
			}, {
				"category": "Product 5",
				"column-1": "2"
			}]
		});

		AmCharts.makeChart("overviewpie2div", {
			type: "pie",
balloonText: "<span style='font-size:12px'><b>[[value]]</b> ([[percents]]%)</span>",
		innerRadius: "65%",
		labelRadius: 6,
		labelText: "[[title]]",
		minRadius: 80,
		pullOutRadius: 6,
		radius: "30%",
		startRadius: "100%",
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		maxLabelWidth: 80,
		pullOutOnlyOne: true,
		sequencedAnimation: false,
		color: "#646464",
		colors: [
			"#3995d4",
			"#37B751",
			"#FD3A07",
			"#37ACC0",
			"#FD6E13",
			"#B0DE09",
		],
		// labelsEnabled: false,
		labelTickAlpha: 0.5,
		outlineAlpha: 1,
		outlineThickness: 2,
		titleField: "category",
		valueField: "column-1",
		allLabels: [],
		balloon: {
			fixedPosition: true,
			borderThickness: 0,
			color: "#FFFFFF",
			fillColor: "#000000",
			shadowAlpha: 0
		},

		titles: [],
		dataProvider: [{
			"category": "Mens red and white tshirt",
			"column-1": "10"
		}, {
			"category": "Product 2",
			"column-1": "9"
		}, {
			"category": "Mens red and black tshirt",
			"column-1": "4"
		}, {
			"category": "Product 4",
			"column-1": "4"
		}, {
			"category": "Product 5",
			"column-1": "2"
		}]
	});

	}])

    .controller('CustomersCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {

    }])

    .controller('ProductsCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {

    }])

    .controller('OrdersCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {

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
