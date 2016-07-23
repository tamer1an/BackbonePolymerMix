module.exports =         {
    "address" : "",
    "addresseeId" : faker.finance.amount(10000, 80000),
    "displayUserIDForExCall" : false,
    "enabled" : Math.random() > 0.5,
    "number" : 1,
    "ownerType" : "User",
    "rule" : (Math.random()>0.5)?
    {
            "Actions" : [
                {
                    "FindMe" : [
                        {
                            "Try" : [
                                {
                                    "To" : [
                                        {
                                            "Ext" : [ "102" ]
                                        },
                                        {
                                            "Id" : [ "00085D235E3F" ]
                                        },
                                        {
                                            "Assigned" : []
                                        },
                                        {
                                            "All" : []
                                        }
                                    ]
                                },
                                {
                                    "For" : [ 7 ]
                                },
                                {
                                    "Ask" : [ 0 ]
                                }
                            ]
                        },
                        {
                            "Bad" : [
                                {
                                    "ForwardToVM" : [ "0" ]
                                }
                            ]
                        }
                    ]
                }
            ],
            "Conditions" : [
                {
                    "Presence" : [ 1, 4 ]
                },
                {
                    "DateRange" : [ "11/25/2015", "11/26/2015" ]
                }
            ],
            "Triggers" : [
                {
                    "AnyCall" : []
                }
            ]
    }
        :
    {
        "Actions" : [
            {
                "ForwardToVM" : [ "0" ]
            }
        ],
        "Triggers" : [
            {
                "AnyCall" : []
            }
        ]
    }
    ,
    "ruleId" : tmplUtils.stringId(),
    "ruleName" : faker.finance.currencyCode(),
    "userId" : tmplUtils.stringId()
};
