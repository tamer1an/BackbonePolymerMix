function createRule(){
    var rule = [],
    defaultInterval = {
        "NotifInterval": [{
            "Period": [ 12 ]
        },{
            "StartFrom": [ "19: 30" ]
        }]
    };

    rule.push({
        "Enabled": [faker.random.boolean()]
    });

    rule.push({
        "IfUnread": [faker.helpers.randomize(['mark_unread', 'mark_saved', 'delete'])]
    });

    if (faker.random.boolean())
    rule.push({
        "MessageClass":[
            faker.helpers.randomize([[
                "normal",
                "private"
            ], [
                "normal",
                "private",
                "urgent"
            ],
                [
                    "private",
                    "urgent"
                ]
            ])
        ]
    });


    if (faker.random.boolean())
    rule.push({
        "NotifInterval": [{
            "Period": []
        },{
            "StartFrom": []
        }]
    });

    if (faker.random.boolean())
    rule.push({
        "MessageMedia": [ faker.helpers.randomize(['fax', 'voice']) ]
    });

    if (faker.random.boolean())
    rule.push({
        "MessageFrom": [ faker.helpers.randomize([faker.internet.email(),  faker.phone.phoneNumber()]) ]
    });

    if (faker.random.boolean())
    rule.push({
        "DaysOfWeek": [ 4,5,6 ]
    });

    if (faker.random.boolean())
    rule.push({
        "MessageOlderThan": [ 3600 ] //seconds
    });

    if (faker.random.boolean())
    rule.push({
        "WhenTimeOfDay": [
            "01: 00",
            "04: 50"
        ]
    });

    if (faker.random.boolean()){
        rule.push({
                "Notify": [{
                    "Transport" : [{
                        "By" : [ "call" ]
                    },{
                        "Destination" : [ faker.phone.phoneNumber() ]
                    },{
                        "CallMethod" : [faker.helpers.randomize([ "simultaneously" ,"sequentially"])]
                    },{
                        "Attempts" : [ faker.helpers.randomize([0,1,2,3,4,5]) ]
                    },{
                        "ToAttach" : [ false ]
                    },{
                        "Pause" : [  faker.helpers.randomize([0,1,5,10,30,60,240]) ]
                    }]
                },{
                    "Transport" : [{
                        "By" : [ "call" ]
                    },{
                        "Destination" : [ faker.phone.phoneNumber()  ]
                    },{
                        "CallMethod" : [ faker.helpers.randomize([ "simultaneously" ,"sequentially"] ) ]
                    },{
                        "Attempts" : [ faker.helpers.randomize([0,1,2,3,4,5]) ]
                    },{
                        "ToAttach" : [ false ]
                    },{
                        "Pause" : [   faker.helpers.randomize([0,1,5,10,30,60,240]) ]
                    }]
                },{
                    "Transport": [{
                        "By": [ "e-mail" ]
                    },{
                        "Destination": [  faker.internet.email() ]
                    },{
                        "CallMethod": [ "simultaneously" ]
                    },{
                        "Attempts" : [ 0 ]
                    },{
                        "ToAttach": [  true ]
                    },{
                        "Pause": [ faker.helpers.randomize([0,1,5,10,30,60,240]) ]
                    }]
                }]
            }
        );
    } else {
        rule.push(defaultInterval);
        rule.push({
                "Notify": [{
                    "Transport": [{
                        "By": [ "e-mail" ]
                    },{
                        "Destination": [  faker.internet.email() ]
                    },{
                        "CallMethod": [ "simultaneously" ]
                    },{
                        "Attempts" : [ 0 ]
                    },{
                        "ToAttach": [  true ]
                    },{
                        "Pause": [ faker.helpers.randomize([0,1,5,10,30,60,240]) ]
                    }]
                }]
            }
        );
    }
    return rule;
}


module.exports = {
    "number": faker.finance.amount(1, 8),
    "ownerType": "User",
    "rule": createRule(),
    "ruleId": faker.random.uuid(),
    "ruleName":  [faker.name.firstName(),' ',faker.name.lastName()," rule "].join(''),
    "userId": faker.random.number()
};