angular.module('myapp')
    .config(myAppRouting);

myAppRouting.$inject = ['$stateProvider', '$urlRouterProvider'];
function myAppRouting($stateProvider, $urlRouterProvider) {
    // send unmatched routes to /home
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('home', {
            url: '/',
            controller: 'homeCtrl',
            templateUrl: 'app/components/home/home.html'
        });
}