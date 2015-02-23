(function() {

'use strict';

/**
 * The ionic-contrib-frosted-glass is a fun frosted-glass effect
 * that can be used in iOS apps to give an iOS 7 frosted-glass effect
 * to any element.
 */
angular.module('ionic.contrib.drawer', ['ionic'])

.controller('drawerCtrl', ['$element', '$attrs', '$timeout', '$ionicGesture', '$document', '$ionicBackdrop', function($element, $attr, $timeout, $ionicGesture, $document, $ionicBackdrop) {
        var ctrl = this;
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

/*
  var enableAnimation = function() {
    $element.addClass('animate');
  };
  var disableAnimation = function() {
    $element.removeClass('animate');
  };
*/

  // Check if this is on target or not
  var isTarget = function(el) {
    while(el) {
      if(el === $element[0]) {
        return true;
      }
      el = el.parentNode;
    }
  };

  var startDrag = function(e) {
    disableAnimation();

    dragging = true;
    offsetX = lastX - startX;
    console.log('Starting drag');
    console.log('Offset:', offsetX);
  };

  var startTargetDrag = function(e) {
    disableAnimation();

    dragging = true;
    isTargetDrag = true;
    offsetX = lastX - startX;
    console.log('Starting target drag');
    console.log('Offset:', offsetX);
  };

  var doEndDrag = function(e) {
    startX = null;
    lastX = null;
    offsetX = null;
    isTargetDrag = false;

    if(!dragging) {
      return;
    }

    dragging = false;

    console.log('End drag');
    enableAnimation();

    ionic.requestAnimationFrame(function() {
      if(newX < (-width / 2)) {
        el.style.transform = el.style.webkitTransform = 'translate3d(' + -width + 'px, 0, 0)';
      } else {
        el.style.transform = el.style.webkitTransform = 'translate3d(0px, 0, 0)';
      }
    });
  };

  var doDrag = function(e) {
    if(e.defaultPrevented) {
      return;
    }

    if(!lastX) {
      startX = e.gesture.touches[0].pageX;
    }

    lastX = e.gesture.touches[0].pageX;

    if(!dragging) {

      // Dragged 15 pixels and finger is by edge
      if(Math.abs(lastX - startX) > thresholdX) {
        if(isTarget(e.target)) {
          startTargetDrag(e);
        } else if(startX < edgeX) {
          startDrag(e);
        } 
      }
    } else {
      console.log(lastX, offsetX, lastX - offsetX);
      newX = Math.min(0, (-width + (lastX - offsetX)));
      ionic.requestAnimationFrame(function() {
        el.style.transform = el.style.webkitTransform = 'translate3d(' + newX + 'px, 0, 0)';
      });

    }

    if(dragging) {
      e.gesture.srcEvent.preventDefault();
    }
  };

  side = $attr.side == 'left' ? LEFT : RIGHT;

  $ionicGesture.on('drag', function(e) {
    doDrag(e);
  }, $document);
  $ionicGesture.on('dragend', function(e) {
    doEndDrag(e);
  }, $document);


  ctrl.close = function() {
    enableAnimation();
    ionic.requestAnimationFrame(function() {
      if(side === LEFT) {
          el.getElementsByClassName('drawer')[0].style.transform = el.getElementsByClassName('drawer')[0].style.webkitTransform = 'translate3d(-100%, 0, 0)';
      } else {
          el.getElementsByClassName('drawer')[0].style.transform = el.getElementsByClassName('drawer')[0].style.webkitTransform = 'translate3d(100%, 0, 0)';
      }
    });
  };

  ctrl.open = function() {
    enableAnimation();
    ionic.requestAnimationFrame(function() {
        console.log(el.getElementsByClassName('drawer'));
        console.log(el);
        console.log($element);
      if(side === LEFT) {
          el.getElementsByClassName('drawer')[0].style.transform = el.getElementsByClassName('drawer')[0].style.webkitTransform = 'translate3d(0%, 0, 0)';
      } else {
          el.getElementsByClassName('drawer')[0].style.transform = el.getElementsByClassName('drawer')[0].style.webkitTransform = 'translate3d(0%, 0, 0)';
      }
    });
  };




            //console.log(el);
            //console.log(tAttrs);


            //console.log($ionicBody);
            //
            //console.log($ionicBody.get());
            //console.log(jqLite(tElement));
            //var cbEle = $document[0].createElement('div');
            //cbEle.className = 'test-block';
            //$ionicBody.append(cbEle);

            /* var side = 'left';

             if (/^primary|secondary|right$/i.test(tAttrs.side || '')) {
             side = tAttrs.side.toLowerCase();
             }

             var spanEle = $document[0].createElement('span');
             spanEle.className = side + '-buttons';
             spanEle.innerHTML = tElement.html();

             var navElementType = side + 'Buttons';

             tElement.attr('class', 'hide');
             tElement.empty();

             return {
             pre: function($scope, $element, $attrs, navBarCtrl) {
             // only register the plain HTML, the navBarCtrl takes care of scope/compile/link

             var parentViewCtrl = $element.parent().data('$ionViewController');
             if (parentViewCtrl) {
             // if the parent is an ion-view, then these are ion-nav-buttons for JUST this ion-view
             parentViewCtrl.navElement(navElementType, spanEle.outerHTML);

             } else {
             // these are buttons for all views that do not have their own ion-nav-buttons
             navBarCtrl.navElement(navElementType, spanEle.outerHTML);
             }

             spanEle = null;
             }
             };*/

     /*   return $timeout(function() {
            //After animating in, allow hide on backdrop click
            self.$el.on('click', function(e) {
                if (self.backdropClickToClose && e.target === self.el) {
                    self.hide();
                }
            });
        }, 400);*/

     /*   var config = {
            stackPushDelay: 400
        };
*/
      /*  $ionicGesture.on('tap', function(e) {
            //console.log(e);
            //console.log($element[0]);
            //console.log(ctrl);
            //if (e.target.classList.contains('backdrop')) {
            //    console.log('clicking on backdrop');
            //}
            //if (ctrl.isOpen) {
                if (!isTarget(e.target) && e.target.classList.contains('backdrop')) {
                    console.log('clicking on backdrop');
                    console.log('close');
                    ctrl.close();
                    $timeout(function() {
                        $ionicBackdrop.release();
                    }, config.stackPushDelay || 0);
                    //$ionicBackdrop.release();
                }
            //}

        }, $document, ctrl);*/
}])

.directive('drawer', ['$rootScope', '$timeout', '$document', '$animate', '$ionicGesture', '$ionicBackdrop', '$ionicBody', function($rootScope, $timeout, $document, $animate, $ionicGesture, $ionicBackdrop, $ionicBody) {
  return {
    restrict: 'E',
      replace: true,
      transclude: true,
      //scope: {},
      //scope: {
      //    drawerSide: '@side'
      //},
    controller: 'drawerCtrl',
      template: '<div class="drawer-backdrop hide">' +
      '<div class="drawer-wrapper" ng-transclude>' +
      '</div>',

      link: function(scope, element, attrs, ctrl) {

          scope.$watch(attrs.animate, function (newVal) {

              var drawerClone = _.cloneDeep(element, function(value) {
                  if (_.isElement(value)) {
                      console.log(value.cloneNode(true));
                  }
              });
/*              console.log(element);
              //var drawerClone = element.cloneTarget();
              console.log(drawerClone);

              console.log(newVal);*/

              if (newVal) {

                  $animate.move(drawerClone, $document[0].body);
                  console.log(element);
                  console.log($document[0].getElementsByName('detailOrdersContent'));
/*                  $animate.addClass(element, 'draw-open',
                      {
                          from: {
                              position: 'absolute',
                              left: '20px',
                              top: '20px'
                          },
                          to: {
                              left: '10px',
                              top: '10px'
                          }
                      });*/

                  //$animate.addClass(element, 'animate');
/*                  $timeout(function() {
                      $animate.addClass(drawerEl, 'animate');
                      //self.el.classList.add('active');
                  }, 20);*/
              } else {
                  $animate.leave(drawerClone);
                 /* $animate.removeClass(element, 'draw-open',
                      {
                          from: {
                              position: 'absolute',
                              left: '10px',
                              top: '10px'
                          },
                          to: {
                              left: '20px',
                              top: '20px'
                          }
                      });*/
              //    console.log(element);
              //    console.log($document[0].getElementsByName('detailOrdersContent'));
              //    $animate.enter(element, $document[0].body, $document[0].getElementsByClassName('backdrop'),
              //        {
              //            from: {
              //                position: 'absolute',
              //                left: '10px',
              //                top: '10px'
              //            },
              //            to: {
              //                left: '20px',
              //                top: '20px'
              //            }
              //        });
                  //$animate.removeClass(element, 'animate');
                  //$timeout(function() {
                  //    $animate.removeClass(drawerEl, 'animate');
                      //self.el.classList.add('active');
                  //}, 20);
              }
          });

          var keyUp = function(e) {
              if(e.which == 27) {
                  console.log('escape key');
                  scope.closeDrawer();
                  //$scope.cancel();
                  //$scope.$apply();
              }
          };

          var backdropClick = function(e) {
              console.log(e.target);
              console.log(element[0]);
              if(e.target == element[0]) {
                  console.log('clicked backdrop');
                  scope.closeDrawer();
                  //$scope.cancel();
                  //$scope.$apply();
              }
          };

   /*       $scope.$on('$destroy', function() {
              $element.remove();
              $document.unbind('keyup', keyUp);
          });*/

          $document.bind('keyup', keyUp);
          element.bind('click', backdropClick);

          //el.addClass($attr.side);

          //$ionicBody.addClass('drawer');
          //$ionicBody.append(el);

          // Example action sheet open
/*          scope.showSheet = function(done) {
              if (scope.removed) return;

              $ionicBody.append(element)
                  .addClass('action-sheet-open');

              $animate.addClass(element, 'active').then(function() {
                  if (scope.removed) return;
                  (done || angular.noop)();
              });
              $timeout(function() {
                  if (scope.removed) return;
                  sheetEl.addClass('action-sheet-up');
              }, 20, false);
          };*/

          //$ionicBody.append(element);

          scope.openDrawer = function() {
              //if (ctrl.closed) return;
              ctrl.open();
              $ionicBody.addClass('drawer-open');

            //console.log(el[0].classList);
              element[0].classList.remove('hide');
              element[0].classList.add('active');
              //el.addClass('active');
              //el.classList.remove('hide');
              console.log('drawer open');
              //$animate.addClass(el[0].getElementsByClassName('drawer'), 'whoop').then(function() {
              //  console.log('done');
              //});

              //ctrl.isOpen = true;
              //$ionicBackdrop.retain()
              //$ionicBackdrop.getElement().addClass('drawer-open');
          };

          scope.closeDrawer = function() {
              //if (ctrl.closed) return;

//              ctrl.closed = true;
              ctrl.close();
              $ionicBody.removeClass('drawer-open');

              element[0].classList.remove('active');
              element[0].classList.add('hide');
              console.log('drawer close');

              //ctrl.isOpen = false;
              //$ionicBackdrop.release();
          };


      }
      //template: '<div class="mydrawer">' +
      //'<div class="mydrawer-yes" ng-transclude>' +
      //'</div>' +
      //'</div>',
/*      compile: function(element, attr) {
          var el = element[0];
          //el.addClass('hellome');

          return function link($scope, $element, $attr, ctrl) {
              $element.addClass($attr.side);
              $ionicBody.addClass('drawer');
              $ionicBody.append(el);

              $scope.openDrawer = function() {
                  console.log('open');
                  ctrl.open();
                  $ionicBackdrop.retain()

              };
              $scope.closeDrawer = function() {
                  console.log('close');
                  ctrl.close();
                  $ionicBackdrop.release();
              };
          };
      }*/
  }
}])

.directive('drawerClose', ['$rootScope', function($rootScope) {
  return {
    restrict: 'A',
    link: function($scope, $element) {
      $element.bind('click', function() {
        var drawerCtrl = $element.inheritedData('$drawerController');
        drawerCtrl.close();
      });
    }
  }
}])

 /*   .directive('customDrawerView', function() {
        return {
            restrict: 'E',
            require: '^drawer',
            link: function(scope, element, attrs, ctrl) {
                element.addClass('drawer');
            }
        };
    })*/


 /*   .animation('.animate', function () {
        return {
            addClass: function (element, className) {
                TweenMax.to(element, 1, {opacity: 1});
            },
            removeClass: function (element, className) {
                TweenMax.to(element, 1, {opacity: 0});
            }
        }
    });*/

})();
