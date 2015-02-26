'use strict';

/* Controllers */

angular.module('woodash.controllers', [])

	.controller('AppCtrl', ['$rootScope','$scope', '$ionicPopover', '$ionicModal', '$ionicSideMenuDelegate', 'GoogleAuthService', 'appData', function ($rootScope, $scope, $ionicPopover, $ionicModal, $ionicSideMenuDelegate, GoogleAuthService, appData) {

        var app = this;
        console.log(appData);
        //var storeData = appData[0].plain()[0];

        //app.siteName = storeData.name;


        // todo: local storage items should not be collected each time AppCtrl is run
        //chrome.storage.local.get('google_auth', function(storage) {
        //    $scope.cloudConnectList = [
        //        { id: 'google_auth', text: "Google Drive", checked: storage.google_auth.isAuthenticated }
        //    ];
        //});

        $scope.detailView = {display: false};

        $scope.siteConnectList = $rootScope.appSites;


        //$scope.cloudConnectChange = function(cloud) {
        //    if (cloud.id == 'google_auth' && !cloud.checked) {
        //        GoogleAuthService.revokeToken();
        //    }
        //};

        //$ionicModal.fromTemplateUrl('templates/modals/app.settings.html', {
        //    scope: $scope,
        //    animation: 'slide-in-up'
        //}).then(function(modal) {
        //    app.settingsModal = modal;
        //});
        //
        //$ionicModal.fromTemplateUrl('templates/modals/woocommerce.store.settings.html', {
        //    scope: $scope,
        //    animation: 'slide-in-up'
        //}).then(function(modal) {
        //    app.wcStoreSettingsModal = modal;
        //});


	}])

    .controller('LoginCtrl', ['$scope', '$state', '$stateParams', 'GoogleAuthService', 'DropboxAuthService', '$ionicLoading', function ($scope, $state, $stateParams, GoogleAuthService, DropboxAuthService, $ionicLoading) {
        console.log($state);
        console.log($stateParams);

        $scope.loginGoogle = function() {
            $ionicLoading.show();
            console.log('loading start');
            GoogleAuthService.getToken({ interactive: true })
                .then(function(results) {
                    console.log(results);
                    if (results.isAuthenticated) {
                        $ionicLoading.hide();
                        console.log('loading stop');
                        $state.go('app.dashboard');
                    }

                });
        };

        $scope.loginDropbox = function() {
            $ionicLoading.show();
            DropboxAuthService.getToken({ interactive: true })
                .then(function(results) {
                    console.log(results);
                    if (results.isAuthenticated) {
                        $ionicLoading.hide();
                        console.log('loading stop');
                        $state.go('app.dashboard');
                    }
                });
        }

    }])

    .controller('DashboardCtrl', ['$rootScope', '$scope', '$ionicModal', '$ionicLoading', function ($rootScope, $scope, $ionicModal, $ionicLoading) {
        console.log('hello dashboard');
    }])

	.controller('OverviewCtrl', ['$scope', 'stateData', function ($scope, stateData) {
        //todo: whether we are in display/split screen view should be handled possibly in resolves
        //$scope.detailView.display = false;

        console.log(stateData);

        //this.orders = initOverview.orders;
        //this.dateRange = initOverview.dateRange;

        //console.log(this.dateRange);
        //console.log(this.orders);
	}])

    .controller('CustomersCtrl', ['$scope', '$http', 'stateData', '$ionicViewSwitcher', '$ionicHistory', function ($scope, $http, stateData, $ionicViewSwitcher, $ionicHistory) {
        var customers = this;

        //todo: This clearHistory function might be heavy as an onclick, look to perform check on state change.
        customers.clearHistory = function () {
            //$ionicViewSwitcher.nextTransition('none');
            $ionicHistory.clearHistory();
            //$ionicHistory.clearCache();
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
        };

        $scope.detailView.display = true;

        //todo: move to services
        angular.forEach(stateData.customers, function(value, key) {
            var customerResource = stateData.customers[key];

            //todo: switch to using restangular
            $http.get(value.avatar_url, {responseType: 'blob'}).success(function(blob, status, headers, config) {
                value.avatar_url_blob = window.URL.createObjectURL(blob);
            });

            customerResource.orders = customerResource.getList('orders');

        });

        customers.list = stateData.customers;

        customers.drawOpen = false;
        customers.toggleDrawer = function () {
            customers.drawOpen = !customers.drawOpen;
        };
    }])

    .controller('CustomersDetailCtrl', ['$rootScope', '$scope', '$stateParams', '$state', function ($rootScope, $scope, $stateParams, $state) {
        var customersdetail = this;

        angular.forEach($scope.customers.list, function(value, key) {
            if (value.id === $stateParams.id) {
                return customersdetail.info = $scope.customers.list[key];
            }
        });

        console.log(customersdetail.info.plain());

        customersdetail.info.orders.then( function (orders) {
            if (orders.length > 0) {
                customersdetail.orders = orders.plain();
            }
        });
    }])

    .controller('CustomersOrderCtrl', ['$scope', '$stateParams', '$state', 'stateData', function ($scope, $stateParams, $state, stateData) {
        var customersorder = this;

/*        angular.forEach(stateData.customers, function(value, key) {
            if (value.id === $stateParams.id) {
                return customersorder.info = stateData.customers[key];
            }
        });

        if (typeof customersorder.info.orders !== 'undefined') {
            customersorder.orders = customersorder.info.orders.plain();
        }

        console.log(customersorder.orders);*/
    }])

    .controller('ProductsCtrl', ['$scope', '$http', 'stateData', function ($scope, $http, stateData) {
        var products = this;

        $scope.detailView.display = true;

        products.list = stateData.products;

        //todo: move to services
        angular.forEach(stateData.products, function(value, key) {
            var productResource = stateData.products[key];

            //todo: switch to using restangular

            /*            productResource.getList('products').then( function (products) {
             if (products.length > 0) {
             productResource.products = products;
             }
             });*/
        });
    }])

    .controller('ProductsDetailCtrl', ['$scope', '$stateParams', '$state', 'stateData', 'firstProduct', function ($scope, $stateParams, $state, stateData, firstProduct) {
        var productsdetail = this;

        angular.forEach(stateData.products, function(value, key) {
            if (value.id === $stateParams.id) {
                return productsdetail.info = stateData.products[key];
            }
        });

        if (typeof productsdetail.info.products !== 'undefined') {
            productsdetail.products = productsdetail.info.products.plain();
        }

        console.log(productsdetail.products);

        //console.log(productsdetail.products);
    }])

    .controller('OrdersCtrl', ['$scope', '$http', 'stateData', function ($scope, $http, stateData) {
        var orders = this;

        $scope.detailView.display = true;

        orders.list = stateData.orders;

        //todo: move to services
        angular.forEach(stateData.orders, function(value, key) {
            var orderResource = stateData.orders[key];

            //todo: switch to using restangular

/*            orderResource.getList('orders').then( function (orders) {
                if (orders.length > 0) {
                    orderResource.orders = orders;
                }
            });*/
        });
    }])

    .controller('OrdersDetailCtrl', ['$scope', '$stateParams', '$state', 'stateData', 'firstOrder', function ($scope, $stateParams, $state, stateData, firstOrder) {
        var ordersdetail = this;

        angular.forEach(stateData.orders, function(value, key) {
            if (value.id === $stateParams.id) {
                return ordersdetail.info = stateData.orders[key];
            }
        });

        if (typeof ordersdetail.info.orders !== 'undefined') {
            ordersdetail.orders = ordersdetail.info.orders.plain();
        }

        console.log(ordersdetail.orders);

        //console.log(ordersdetail.orders);
    }])

    .controller('PlayboxCtrl', ['$scope', function ($scope) {
        var playbox = this;

        chrome.syncFileSystem.requestFileSystem(function (fs) {
            // FileSystem API should just work on the returned 'fs'.
            //fs.root.getFile('test.txt', {create:true}, getEntryCallback, errorCallback);
            console.log(fs);
            console.log(chrome);
        });

        var ENTER_KEY = 13;
        var newTodoDom = document.getElementById('new-todo');
        var syncDom = document.getElementById('sync-wrapper');

        // EDITING STARTS HERE (you dont need to edit anything above this line)

        var db = new PouchDB('todos');

        // Replace with remote instance, this just replicates to another local instance.
        var remoteCouch = 'todos_remote';

        db.changes({
            since: 'now',
            live: true
        }).on('change', showTodos);

        // We have to create a new todo document and enter it in the database
        function addTodo(text) {
            var todo = {
                _id: new Date().toISOString(),
                title: text,
                completed: false
            };
            db.put(todo, function callback(err, result) {
                if (!err) {
                    console.log('Successfully posted a todo!');
                }
            });
        }

        // Show the current list of todos by reading them from the database
        function showTodos() {
            db.allDocs({include_docs: true, descending: true}, function(err, doc) {
                redrawTodosUI(doc.rows);
            });
        }

        function checkboxChanged(todo, event) {
            todo.completed = event.target.checked;
            db.put(todo, function callback(err, result) {
                if (!err) {
                    console.log('Successfully changed a todo!');
                }
            });
        }

        // User pressed the delete button for a todo, delete it
        function deleteButtonPressed(todo) {
            db.remove(todo);
        }

        // The input box when editing a todo has blurred, we should save
        // the new title or delete the todo if the title is empty
        function todoBlurred(todo, event) {
            var trimmedText = event.target.value.trim();
            if (!trimmedText) {
                db.remove(todo);
            } else {
                todo.title = trimmedText;
                db.put(todo);
            }
        }

        // Initialise a sync with the remote server
        function sync() {
            syncDom.setAttribute('data-sync-state', 'syncing');
            var opts = {live: true};
            db.replicate.to(remoteCouch, opts, syncError);
            db.replicate.from(remoteCouch, opts, syncError);
        }

        // EDITING STARTS HERE (you dont need to edit anything below this line)

        // There was some form or error syncing
        function syncError() {
            syncDom.setAttribute('data-sync-state', 'error');
        }

        // User has double clicked a todo, display an input so they can edit the title
        function todoDblClicked(todo) {
            var div = document.getElementById('li_' + todo._id);
            var inputEditTodo = document.getElementById('input_' + todo._id);
            div.className = 'editing';
            inputEditTodo.focus();
        }

        // If they press enter while editing an entry, blur it to trigger save
        // (or delete)
        function todoKeyPressed(todo, event) {
            if (event.keyCode === ENTER_KEY) {
                var inputEditTodo = document.getElementById('input_' + todo._id);
                inputEditTodo.blur();
            }
        }

        // Given an object representing a todo, this will create a list item
        // to display it.
        function createTodoListItem(todo) {
            var checkbox = document.createElement('input');
            checkbox.className = 'toggle';
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', checkboxChanged.bind(this, todo));

            var label = document.createElement('label');
            label.appendChild( document.createTextNode(todo.title));
            label.addEventListener('dblclick', todoDblClicked.bind(this, todo));

            var deleteLink = document.createElement('button');
            deleteLink.className = 'destroy';
            deleteLink.addEventListener( 'click', deleteButtonPressed.bind(this, todo));

            var divDisplay = document.createElement('div');
            divDisplay.className = 'view';
            divDisplay.appendChild(checkbox);
            divDisplay.appendChild(label);
            divDisplay.appendChild(deleteLink);

            var inputEditTodo = document.createElement('input');
            inputEditTodo.id = 'input_' + todo._id;
            inputEditTodo.className = 'edit';
            inputEditTodo.value = todo.title;
            inputEditTodo.addEventListener('keypress', todoKeyPressed.bind(this, todo));
            inputEditTodo.addEventListener('blur', todoBlurred.bind(this, todo));

            var li = document.createElement('li');
            li.id = 'li_' + todo._id;
            li.appendChild(divDisplay);
            li.appendChild(inputEditTodo);

            if (todo.completed) {
                li.className += 'complete';
                checkbox.checked = true;
            }

            return li;
        }

        function redrawTodosUI(todos) {
            var ul = document.getElementById('todo-list');
            ul.innerHTML = '';
            todos.forEach(function(todo) {
                ul.appendChild(createTodoListItem(todo.doc));
            });
        }

        function newTodoKeyPressHandler( event ) {
            if (event.keyCode === ENTER_KEY) {
                addTodo(newTodoDom.value);
                newTodoDom.value = '';
            }
        }

        function addEventListeners() {
            newTodoDom.addEventListener('keypress', newTodoKeyPressHandler, false);
        }

        addEventListeners();
        showTodos();

        //if (remoteCouch) {
        //    sync();
        //}

/*        var db = new ForerunnerDB();
        var itemCollection = db.collection('item');
        itemCollection.setData([{
            _id: 1,
            name: 'Cat Litter',
            price: 200
        }, {
            _id: 2,
            name: 'Dog Food',
            price: 100
        }]);

        console.log(itemCollection);

        itemCollection.save(function (err) {
            console.log(err);
            if (!err) {
                // Save was successful
            }
        });*/

        // Ask forerunner to load any persistent data previously
        // saved for this collection

    }]);