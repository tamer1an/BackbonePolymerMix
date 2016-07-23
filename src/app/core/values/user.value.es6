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
        userEntity: {
            'adminProfile': {
                'profileId': {
                    'type': 'string'
                },
                'profileName': {
                    'type': 'string'
                }
            },
            'callRecProfile': {
                'profileId': {
                    'type': 'string'
                },
                'profileName': {
                    'type': 'string'
                }
            },
            'pagingProfile': {
                'profileId': {
                    'type': 'string'
                },
                'profileName': {
                    'type': 'string'
                }
            },
            'userProfile': {
                'profileId': {
                    'type': 'string'
                },
                'profileName': {
                    'type': 'string'
                }
            },
            'callerId': {
                'type': 'string'
            },
            'cellPhone': {
                'type': 'string'
            },
            'defaultRole': {
                'roleId': {
                    'type': 'string'
                },
                'roleName': {
                    'type': 'string'
                }
            },
            'devices': {
                'type': 'array'
            },
            'email': {
                'type': 'string'
            },
            'email2': {
                'type': 'string'
            },
            'extension': {
                'type': 'string'
            },
            'faxDID': {
                'type': 'string'
            },
            'faxNumber': {
                'type': 'string'
            },
            'firstName': {
                'type': 'string'
            },
            'homePhone': {
                'type': 'string'
            },
            'lastName': {
                'type': 'string'
            },
            'ldapAuthentication': {
                'type': 'string'
            },
            'login': {
                'type': 'string'
            },
            'msExchangeId': {
                'type': 'string'
            },
            'password': {
                'type': 'string'
            },
            'pin': {
                'type': 'string'
            },
            'pseudonym': {
                'type': 'string'
            },
            'userId': {
                'type': 'string'
            },
            'userRecId': {
                'type': 'string'
            },
            'voiceDID': {
                'type': 'string'
            }
        },

        getSession () {
            return this.userSession;
        }
    };

    angular
        .module('app.core')
        .value('User',user);
})();
