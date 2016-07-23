module.exports = {
    id: tmplUtils.stringId(),
    owner: faker.name.firstName() + ' ' + faker.name.lastName(),
    roles: faker.company.bsNoun() + ', ' + faker.company.bsNoun(),
    name: faker.company.companyName(),
    description: faker.company.catchPhraseDescriptor(),
    startDate: faker.date.past(),
    endDate: faker.date.future(),
    creationDate: faker.date.past(),
    version: faker.finance.amount(1, 2)
};
