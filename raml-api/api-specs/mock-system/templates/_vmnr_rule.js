var enabled = Math.random() > 0.5;

module.exports = {
    "number": faker.finance.amount(1, 8),
    "ownerType": "User",
    "enabled" : enabled,
    "rule": (!enabled)?
    [
        {
            "Enabled": [enabled]
        },
        {
            "IfUnread": ["mark_unread"]
        },
        {
            "MessageClass": [
                "normal",
                "private"
            ]
        },
        {
            "MessageFrom": [
                "042"
            ]
        }
    ]

    :

    [
        {
            "Enabled": [
                false
            ]
        },
        {
            "NotifInterval": [
                {
                    "Period": [
                        12
                    ]
                },
                {
                    "StartFrom": [
                        "19: 30"
                    ]
                }
            ]
        },
        {
            "IfUnread": [
                "mark_saved"
            ]
        },
        {
            "MessageFrom": [
                "042"
            ]
        },
        {
            "WhenTimeOfDay": [
                "01: 00",
                "04: 50"
            ]
        },
        {
            "MessageMedia": [
                "fax"
            ]
        },
        {
            "MessageClass": [
                "normal",
                "urgent",
                "private"
            ]
        },
        {
            "DaysOfWeek": [
                4
            ]
        },
        {
            "MessageOlderThan": [
                1
            ]
        },
        {
            "Notify": [
                {
                    "Transport": [
                        {
                            "By": [
                                "e-mail"
                            ]
                        },
                        {
                            "Destination": [
                                "1@mail"
                            ]
                        },
                        {
                            "CallMethod": [
                                "simultaneously"
                            ]
                        },
                        {
                            "ToAttach": [
                                true
                            ]
                        },
                        {
                            "Pause": [
                                0
                            ]
                        }
                    ]
                }
            ]
    }],
    "ruleId": tmplUtils.stringId(),
    "ruleName":  [faker.name.firstName(),' ',faker.name.lastName()," rule ",faker.finance.amount(1, 5)].join(''),
    "userId": tmplUtils.stringId()
};


/*
[
    {
        "Enabled": [false]
    },
    {
        "IfUnread": ["mark_unread"]
    },
    {
        "MessageClass": [
            "normal",
            "private"
        ]
    },
    {
        "MessageMedia": [
            "fax"
        ]
    },
    {
        "MessageFrom": [
            "042greg"
        ]
    },
    {
        "DaysOfWeek": [
            4,5,6
        ]
    },
    {
        "MessageOlderThan": [ //seconds
            3600
        ]
    },
    {
        "WhenTimeOfDay": [
            "01: 00",
            "04: 50"
        ]
    }
]*/
