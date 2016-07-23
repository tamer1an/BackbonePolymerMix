module.exports = {
    "number": faker.finance.amount(1, 8),
    "ownerType": "User",
    "rule": [
        {
            "Enabled": [false]
        },
        {
            "IfUnread": ["mark_unread"]
        }
    ],
    "ruleId": tmplUtils.stringId(),
    "ruleName":  [faker.name.firstName(),' ',faker.name.lastName()," rule ",faker.finance.amount(1, 5)].join(''),
    "userId": tmplUtils.stringId()
};