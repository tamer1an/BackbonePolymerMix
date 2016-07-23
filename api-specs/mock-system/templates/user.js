module.exports = {
    id: tmplUtils.stringId(),
    email: faker.internet.email(),
    name: faker.name.firstName() + ' ' + faker.name.lastName(),
};
