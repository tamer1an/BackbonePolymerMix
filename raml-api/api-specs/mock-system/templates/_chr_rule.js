function createRule(){
    var conditions = [],
        triggers = [],
        actions = [];

    actions.push(
        faker.helpers.randomize([
            {
                "FindMe": [
                    {
                        "Try": [{
                            "To": [{
                                "Ext": [ faker.helpers.randomize([
                                        [faker.finance.mask(),faker.finance.mask(),faker.finance.mask()],
                                        [faker.finance.mask(),faker.finance.mask()],
                                        [faker.finance.mask()],
                                        [],[]
                                     ])
                                ]
                            },{
                                "Id": [ faker.random.number()  ]
                            },{
                                "Assigned": [ faker.helpers.randomize(["bound" ,"cell" ,"home" ,"assigned" ])]
                            },{
                                "All": faker.helpers.randomize([ [], [true] ])
                            }]
                        },{
                            "For": [ faker.random.number() ] //duration in second for call
                        },{
                            "Ask": [ faker.random.boolean()?1:0]
                        }]
                    },{
                        "Bad": [{ "ForwardToVM": ["0"] }] //TODO: -2.p
                    }
                ]
            },{
                "ForwardTo":["1001"]
            },{
                "ForwardToVM":["0.p"]
            },{
                "Reject":[]
            }
        ])
    );

    if (faker.random.boolean())
        actions.push("Updates");

    triggers = faker.helpers.randomize([
            [
                {
                    "Busy":[
                        //always empty
                    ]
                },
                {
                    "NoAnswer":[ faker.random.number() ]
                }
            ],[
                {
                    "AnyCall":[
                        //always empty
                    ]
                }
            ],[
                {
                    "Busy":[ ]
                }
            ],[
                {
                    "NoAnswer":[ faker.random.number() ]
                }
            ]
        ]);


    conditions = [
        {
            "DateRange":[
                "",
                "9/9/2015"
            ]
        },
        {
            "TimeFrame":[
                "00:00",
                "15:10"
            ]
        },
        {
            "Holidays":[
                //always empty
            ]
        },
        {
            "Presence":
                faker.helpers.randomize([
                    [0,1,2,7,10],
                    [0,1,2,3,4,5,6,7,10],
                    [0,7,10],
                    [0,1,2,7,10],
                    [0,1,2,3]
                ])
        },{
            "CallFrom":[faker.phone.phoneNumber()]
        },{
            "WeekDays":[
                faker.helpers.randomize([
                    [ 4,5,6 ],
                    [ 1,3,6 ],
                    [ 3,4,6 ],
                    [ 2,5,7 ]
                ])
            ]
        }
    ];

    return {
        Actions:actions,
        Conditions:conditions,
        Triggers:triggers
    };
}



module.exports =         {
    "address" : faker.address.streetAddress(),
    "addresseeId" : faker.address.zipCode(),
    "displayUserIDForExCall" : faker.random.boolean(),
    "enabled" : faker.random.boolean(),
    "number" : 1,
    "ownerType" : "User",
    "rule" : createRule(),
    "ruleId" : tmplUtils.stringId(),
    "ruleName" : [faker.name.firstName(),' ',faker.name.lastName()," rule "].join(''),
    "userId" : faker.random.number()
};
