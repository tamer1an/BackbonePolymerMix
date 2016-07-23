module.exports = {
    "businessPhone": faker.finance.mask(),
    "cellPhone": faker.phone.phoneNumber(),
    "email1": faker.internet.email(),
    "email2": faker.internet.email(),
    "faxNumber": faker.phone.phoneNumber(),
    "firstName": faker.name.firstName(),
    "homePhone": faker.phone.phoneNumber(),
    "lastName": faker.name.lastName()
};