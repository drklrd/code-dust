'use strict';
var routes = angular.module('codeDust.routes',[]);

routes.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

    $urlRouterProvider.otherwise('/playground');

    $stateProvider
        .state('playground',{
            url : '/playground',
            templateUrl : '/templates/playground',
            controller : 'playgroundController'
        })
        

}]);