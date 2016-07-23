(function() {
    'use strict';

    angular.module('app.chr').run(['stateService', function(stateService) {
        const stateName = ['chr'];

        stateService.addState(stateName[0], {
            url: `/${stateName}`,
            templateUrl: `app/${stateName[0]}/components/${stateName[0]}.tpl.html`,  //['app/',stateName[0],'/components/',stateName[0],'.tpl.html'].join(''),
            controller:'chrController',
            resolve:{
                settings : function(Settings, User) {
                    User.chr.editState = false;
                    Settings.page.title = 'Call Handling Rules';
                    Settings.page.icon = 'mdi-call-split';
                    return Settings;
                }
            }
        });
    }]);
})();
