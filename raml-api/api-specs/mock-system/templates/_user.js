


module.exports = {
    "adminProfile" : {
        "profileId" : "",
        "profileName" : ""
    },
    "callRecProfile" : {
        "profileId" : "",
        "profileName" : ""
    },
    "callerId" : "1313",
    "cellPhone" : "",
    "defaultRole" : {
        "roleId" : "",
        "roleName" : ""
    },
    "devices" : [
        {
            "deviceId" : tmplUtils.stringId(),
            "deviceRecId" : tmplUtils.stringId(),
            "deviceType" : "ZIP 35i",
            "ipAddress" : "",
            "lines" : [
                {
                    "deviceId" : "sdfsdf",
                    "name" : "",
                    "sipAuth" : "sdfsdf",
                    "sipPwd" : ""
                }
            ],
            "location" : faker.address.city(),
            "macAddress" : "000BEA888889",
            "profileName" : "zippo 35i",
            "users" : [ "43283552513373536", "43283552047541480" ]
        }
    ],
    "email" : faker.internet.email(),
    "email2" : faker.internet.email(),
    "extension" : "4160",
    "faxDID" : "",
    "faxNumber" : "",
    "firstName" : faker.name.firstName(),
    "homePhone" : "",
    "lastName" : faker.name.lastName(),
    "ldapAuthentication" : false,
    "login" : "Login_4160",
    "msExchangeId" : faker.internet.email(),
    "pagingProfile" : {
        "profileId" : "",
        "profileName" : ""
    },
    "password" : "",
    "pin" : "",
    "pseudonym" : "",
    "userId" : "my_user_4160",
    "userProfile" : {
        "profileId" : tmplUtils.stringId(),
        "profileName" : "Default"
    },
    "userRecId" : tmplUtils.stringId(),
    "voiceDID" : ""
};