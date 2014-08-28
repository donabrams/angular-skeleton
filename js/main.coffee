app = angular.module 'simpleGantt', []
app.directive 'tester', () ->
  restrict: 'E'
  template: '<div>{{success}}</div>'
  controller: ($scope) ->
    $scope.success = 'successful'