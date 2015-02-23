(function () {

    'use strict';

    /**
     * The ionic-contrib-frosted-glass is a fun frosted-glass effect
     * that can be used in iOS apps to give an iOS 7 frosted-glass effect
     * to any element.
     */
    angular.module('ionic.contrib.drawer', ['ionic'])

        .controller('drawerCtrl', ['$element', '$attrs', '$timeout', '$ionicGesture', '$document', function ($element, $attr, $timeout, $ionicGesture, $document) {
            var el = $element[0];
            var dragging = false;
            var startX, lastX, offsetX, newX;
            var side;

            // How far to drag before triggering
            var thresholdX = 15;
            // How far from edge before triggering
            var edgeX = 40;

            var LEFT = 0;
            var RIGHT = 1;

            var isTargetDrag = false;

            var width = $element[0].clientWidth;

            // Check if this is on target or not
            var isTarget = function (el) {
                while (el) {
                    if (el === $element[0]) {
                        return true;
                    }
                    el = el.parentNode;
                }
            };

            var startDrag = function (e) {
                disableAnimation();

                dragging = true;
                offsetX = lastX - startX;
                console.log('Starting drag');
                console.log('Offset:', offsetX);
            };

            var startTargetDrag = function (e) {
                disableAnimation();

                dragging = true;
                isTargetDrag = true;
                offsetX = lastX - startX;
                console.log('Starting target drag');
                console.log('Offset:', offsetX);
            };

            var doEndDrag = function (e) {
                startX = null;
                lastX = null;
                offsetX = null;
                isTargetDrag = false;

                if (!dragging) {
                    return;
                }

                dragging = false;

                console.log('End drag');
                enableAnimation();

                ionic.requestAnimationFrame(function () {
                    if (newX < (-width / 2)) {
                        el.style.transform = el.style.webkitTransform = 'translate3d(' + -width + 'px, 0, 0)';
                    } else {
                        el.style.transform = el.style.webkitTransform = 'translate3d(0px, 0, 0)';
                    }
                });
            };

            var doDrag = function (e) {
                if (e.defaultPrevented) {
                    return;
                }

                if (!lastX) {
                    startX = e.gesture.touches[0].pageX;
                }

                lastX = e.gesture.touches[0].pageX;

                if (!dragging) {

                    // Dragged 15 pixels and finger is by edge
                    if (Math.abs(lastX - startX) > thresholdX) {
                        if (isTarget(e.target)) {
                            startTargetDrag(e);
                        } else if (startX < edgeX) {
                            startDrag(e);
                        }
                    }
                } else {
                    console.log(lastX, offsetX, lastX - offsetX);
                    newX = Math.min(0, (-width + (lastX - offsetX)));
                    ionic.requestAnimationFrame(function () {
                        el.style.transform = el.style.webkitTransform = 'translate3d(' + newX + 'px, 0, 0)';
                    });

                }

                if (dragging) {
                    e.gesture.srcEvent.preventDefault();
                }
            };

            side = $attr.side == 'left' ? LEFT : RIGHT;

            $ionicGesture.on('drag', function (e) {
                doDrag(e);
            }, $document);
            $ionicGesture.on('dragend', function (e) {
                doEndDrag(e);
            }, $document);

        }])

        .directive('drawer', ['$rootScope', '$timeout', '$document', '$animate', '$ionicGesture', '$ionicBackdrop', '$ionicBody', function ($rootScope, $timeout, $document, $animate, $ionicGesture, $ionicBackdrop, $ionicBody) {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                controller: 'drawerCtrl',
                template: '<div class="drawer-backdrop">' +
                '<div class="drawer-wrapper" ng-transclude>' +
                '</div>',

                link: function (scope, element, attrs, ctrl) {

                    scope.$watch(attrs.animate, function (newVal) {

                        console.log(newVal);

                        if (newVal) {
                            $animate.move(element, $document[0].body, $document[0].getElementsByClassName('backdrop'), {
                                from: {
                                    backgroundColor: 'rgba(0, 0, 0, 0)',
                                    display: 'none'
                                },
                                to: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    display: 'block'
                                }
                            }).then(function () {
                                element.find('drawer-view').addClass('draw-open');
                            });
                        } else {
                            element.find('drawer-view').removeClass('draw-open').addClass('draw-close');
                            $timeout(function() {
                                $animate.move(element, $document[0].getElementsByClassName('drawer-container'), null, {
                                    from: {
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        display: 'block'
                                    },
                                    to: {
                                        backgroundColor: 'rgba(0, 0, 0, 0)',
                                        display: 'none'
                                    }
                                });
                            }, 300);
                        }
                    });

                    var keyUp = function (e) {
                        if (e.which == 27) {
                            console.log('escape key');
                            scope.$apply(function() {
                                scope.$parent.customers.toggleDrawer();
                            });
                        }
                    };

                    var backdropClick = function (e) {
                        if (e.target == element[0]) {
                            console.log('clicked backdrop');
                            console.log(scope);
                            scope.$apply(function() {
                                scope.$parent.customers.toggleDrawer();
                            });
                        }
                    };
                    
                    $document.bind('keyup', keyUp);
                    element.bind('click', backdropClick);
                }

            }
        }])

        .directive('drawerClose', ['$rootScope', function ($rootScope) {
            return {
                restrict: 'A',
                link: function ($scope, $element) {
                    $element.bind('click', function () {
                        var drawerCtrl = $element.inheritedData('$drawerController');
                        drawerCtrl.close();
                    });
                }
            }
        }]);

})();