'use strict';

angular.module('myApp.view1', [ 'ngRoute', 'isteven-rr', 'hljs' ])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });

    $routeProvider.when('/view1/:param1/:param2', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });  
}])

.controller('View1Ctrl', [ '$scope', '$routeParams', function( $scope, $routeParams ) {       
}]);

