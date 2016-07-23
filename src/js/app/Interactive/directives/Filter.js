'use strict';

angular.module( "Interactive")
       .directive( "filter", function(){
           return {
               restrict: 'A',
               templateUrl: 'html/directives/filter.html',
               controller: 'FilterController',
               scope: {
                   filters: "=filters"
               }
           };
       });