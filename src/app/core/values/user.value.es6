(function() {
    'use strict';

    var user = {
        userSession:{
            is_logged:false,
            session:'',
            read_commands:[],
            write_commands:[]
        },
        vmnr: {
            rules:[],
            RAW_rules:[],
            editState:false
        },
        chr: {
            rules:[],
            RAW_rules:[],
            editState:false
        },
        addressBook:[],
        userEntity: {
            login: ''
        },

        getSession () {
            return this.userSession;
        }
    };

    angular
        .module('app.core')
        .value('User',user);
})();
