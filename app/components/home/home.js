angular.module('myapp')
    .controller('homeCtrl', homeController);

homeController.$inject = ['$scope'];
function homeController($scope) {
    $scope.success = 'successful';
}