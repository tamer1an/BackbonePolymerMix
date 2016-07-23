(function() {
    'use strict';

    var user = {
        userSession:{
            is_logged:false
        },

        userEntity: {

        },

        getSession () {
            return this.userSession;
        }
    };

    angular
        .module('app.core')
        .value('User',user);
})();
