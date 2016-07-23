(function() {
    'use strict';

    angular.module('app')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/login');
        })
        .provider('dynamicStates', dynamicStates)
        .factory('stateService', stateService)
        .run(['stateService', function(stateService) {
            const stateName = ['login'];

            stateService.addState(stateName[0], {
                url: '/'+stateName[0],
                templateUrl: 'app/core/components/'+stateName[0]+'.tpl.html'
            });
    }]);

    stateService.$inject = ['dynamicStates'];

    function dynamicStates($stateProvider) {
        this.$get = function() {
            return {
                addState: function(name, config) {
                    $stateProvider.state(name, config);
                }
            }
        }
    }

    function stateService(dynamicStates) {
        return dynamicStates
    }


})();