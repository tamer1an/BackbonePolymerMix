var issued = faker.date.future(),
    expired = faker.date.future();

module.exports = {
    access_token: tmplUtils.stringId(),
    token_type: "bearer",
    expires_in: 1209599,
    userName: faker.internet.email(),
    issued: issued,
    expired: expired
};
