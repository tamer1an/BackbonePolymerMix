(function() {
    'use strict';

    const enviroment = true;

    var settings = {
        checkSession (session,state) {
          if(!session.is_logged){
              state.go('login');
          }
        },
        getEnviroment () {
            return enviroment;
        },
        page:{
            title: '',
            icon:'',
            breadcrumb:''
        }
    };

    angular
        .module('app.core')
        .value('Settings',settings);
})();
