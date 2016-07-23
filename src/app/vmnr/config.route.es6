(function() {
    'use strict';

    angular.module('app.vmnr').run(['stateService', function(stateService) {
        const stateName = ['vmnr'];

        stateService.addState(stateName[0], {
            url: '/'+stateName,
            templateUrl: ['app/',stateName[0],'/components/',stateName[0],'.tpl.html'].join('')
        });
    }]);
})();