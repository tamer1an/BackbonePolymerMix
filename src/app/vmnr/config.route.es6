(function() {
    'use strict';

    angular.module('app.vmnr').run(['stateService', function(stateService) {
        const stateName = ['vmnr'];

        stateService.addState(stateName[0], {
            url: `/${stateName}`,
            templateUrl: `app/${stateName[0]}/components/${stateName[0]}.tpl.html`,
            controller:'vmnrController',
            resolve:{
                settings : function(Settings, User) {
                    User.vmnr.editState = false;
                    Settings.page.title = 'Voice Notifications';
                    Settings.page.icon = 'mdi-voicemail';
                    return Settings;
                }
            }
        });
    }]);
})();
