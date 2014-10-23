(function() {
  var app = angular.module('myapp', []);
  app.directive('tester', function() {
    return {
      restrict: 'E',
      template: '<div>{{success}}</div>',
      controller: function($scope) {
        return $scope.success = 'successful';
      }
    };
  });
}).call(this);
