'use strict';
var routes = angular.module('codeDust.routes',[]);

routes.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

    $urlRouterProvider.otherwise('/landing');

    $stateProvider
        .state('landing',{
            url : '/landing',
            templateUrl : '/templates/landing',
            controller : 'landingController'
        })
        .state('playground',{
            url : '/playground/:id',
            templateUrl: function ($stateParams){
                 return '/templates/playground/' + $stateParams.id;
            },
            controller : 'playgroundController',
            params : {
                welcomeCoder : null
            }
        })
        

}]);