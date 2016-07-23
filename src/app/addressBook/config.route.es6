(function() {
    'use strict';

    angular.module('app.addressBook').run(['stateService', function(stateService) {
        const stateName = ['addressBook'];

        stateService.addState(stateName[0], {
            url: `/${stateName}` ,
            templateUrl: `app/${stateName[0]}/components/${stateName[0]}.tpl.html`,
            controller:'AddressBookController',
            resolve:{
                settings : function(Settings) {
                    Settings.page.title = 'Address Book'; 
                    Settings.page.icon  = 'mdi-contact-mail'; 
                    return Settings;
                }
            }
        });
    }]);
})();
