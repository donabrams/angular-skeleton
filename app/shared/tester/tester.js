angular.module('myapp')
    .directive('tester', testerDirective);

function testerDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/shared/tester/tester.html'
    };
}