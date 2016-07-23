modules.define('i-config', ['react', 'underscore', 'jquery'], function(provide, React, _, $) {

    var iConfig = React.createClass({
        statics: {
            'url-api': '/admin/',

            'user-card': [
                {
                    header: 'Properties',
                    content: [
                        'userId', 'firstName', 'lastName', 'login',
                        'ldapAuthentication', 'password', 'pin', 'pseudonym', 'extension',
                        'voiceDID', 'faxDID', 'callerId', 'msExchangeId', 'defaultRole'
                    ]
                },
                {
                    header: 'Profiles',
                    content: [
                        'userProfile', 'adminProfile',
                        'pagingProfile', 'callRecProfile'
                    ]
                },
                {
                    header: 'Additional Info',
                    content: [
                        'homePhone', 'cellPhone', 'faxNumber', 'email',
                        'email2'
                    ]
                }
            ],

            'device-list': ['deviceId', 'deviceType', 'profileName', 'macAddress', 'location', 'ipAddress'],

            'device-card': [
                'profileName', 'location', 'macAddress', 'ipAddress', ['deviceId', 'name', 'sipPwd', 'sipAuth']
            ],

            'devices-type': [
                {
                    "name": "ZIP 2",
                    "section": "Zultys ZIP 2 models"
                },
                {
                    "name": "ZIP 2+",
                    "section": "Zultys ZIP 2 models"
                },
                {
                    "name": "ZIP 2P",
                    "section": "Zultys ZIP 2 models"
                },
                {
                    "name": "ZIP 2x2L",
                    "section": "Zultys ZIP 2 models"
                },
                {
                    "name": "ZIP 2x1",
                    "section": "Zultys ZIP 2 models"
                },
                {
                    "name": "ZIP 2x2",
                    "section": "Zultys ZIP 2 models"
                },
                {
                    "name": "ZIP 33i",
                    "section": "Zultys ZIP 3 models"
                },
                {
                    "name": "ZIP 35i",
                    "section": "Zultys ZIP 3 models"
                },
                {
                    "name": "ZIP 36G",
                    "section": "Zultys ZIP 3 models"
                },
                {
                    "name": "ZIP 37G",
                    "section": "Zultys ZIP 3 models"
                },
                {
                    "name": "ZIP 4x4",
                    "section": "Zultys ZIP 4 models"
                },
                {
                    "name": "ZIP 4x4B",
                    "section": "Zultys ZIP 4 models"
                },
                {
                    "name": "ZIP 4x4L",
                    "section": "Zultys ZIP 4 models"
                },
                {
                    "name": "ZIP 4x5",
                    "section": "Zultys ZIP 4 models"
                },
                {
                    "name": "ZIP 4x5B",
                    "section": "Zultys ZIP 4 models"
                },
                {
                    "name": "ZIP 4x5L",
                    "section": "Zultys ZIP 4 models"
                },
                {
                    "name": "ZIP 51i",
                    "section": "Zultys ZIP 5 models"
                },
                {
                    "name": "ZIP 51e",
                    "section": "Zultys ZIP 5 models"
                },
                {
                    "name": "ZIP 53i",
                    "section": "Zultys ZIP 5 models"
                },
                {
                    "name": "ZIP 53e",
                    "section": "Zultys ZIP 5 models"
                },
                {
                    "name": "ZIP 55i",
                    "section": "Zultys ZIP 5 models"
                },
                {
                    "name": "ZIP 55G",
                    "section": "Zultys ZIP 5 models"
                },
                {
                    "name": "ZIP 57i",
                    "section": "Zultys ZIP 5 models"
                },
                {
                    "name": "ZIP 57G",
                    "section": "Zultys ZIP 5 models"
                },
                {
                    "name": "ZIP 57i CT",
                    "section": "Zultys ZIP 5 models"
                },
                {
                    "name": "ZIP 59i",
                    "section": "Zultys ZIP 5 models"
                },
                {
                    "name": "WIP 2",
                    "section": "WIP models"
                },
                {
                    "name": "Cisco 7960",
                    "section": "CISCO SIP Phones"
                },
                {
                    "name": "Polycom",
                    "section": "Polycom SIP Phones"
                },
                {
                    "name": "Aastra",
                    "section": "Aastra SIP Phones"
                },
                {
                    "name": "Generic",
                    "section": "GenericSip"
                }
            ],

            getProps: function (name) {
                return this[name];
            }
        },

        render: function () {}
    });

    provide(iConfig);
});
