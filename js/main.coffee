app = angular.module 'myapp', []
app.directive 'tester', () ->
  restrict: 'E'
  template: '<div>{{success}}</div>'
  controller: ($scope) ->
    $scope.success = 'successful'