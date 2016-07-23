//var _res;
//
//_res = tmplUtils.multiCollection(5, 20)(function (i) {
//    return tmplUtils.getTemplate('user.js');
//});

//_res;

module.exports = {
    "command" : "get_locations",
    "locations" :  [
        {
            "ani" : "",
            "audioBandwidth" : 0,
            "bandwidth" : 0,
            "connectionType" : "ctLAN",
            "emergencyPhone" : [
                {
                    "dialedPhone" : "911",
                    "emPhoneId" : 1,
                    "route" : [
                        {
                            "emRouteId" : 1,
                            "realPhone" : "911"
                        }
                    ]
                }
            ],
            "isDefault" : true,
            "name" : "LosAngeles",
            "timezone" : "America/Los_Angeles",
            "videoBandwidth" : 0
        },
        {
            "ani" : "",
            "audioBandwidth" : 0,
            "bandwidth" : 0,
            "connectionType" : "ctLAN",
            "emergencyPhone" : [
                {
                    "dialedPhone" : "112",
                    "emPhoneId" : 2,
                    "route" : [
                        {
                            "emRouteId" : 2,
                            "realPhone" : "112"
                        }
                    ]
                }
            ],
            "isDefault" : false,
            "name" : "Kyiv",
            "timezone" : "Europe/Kiev",
            "videoBandwidth" : 0
        }
    ],
    "index" : 0,
    "success" : true
};