module.exports = {
    'id': tmplUtils.stringId(),

    'clientCountryId': tmplUtils.stringId(),
    'clientCountryName' : faker.address.country(),
    'clientCountryCode' : faker.address.countryCode(),

    'clientCurrencyId': tmplUtils.stringId(),
    'clientCurrencyName' : faker.finance.currencyName(),
    'clientCurrencyCode' : faker.finance.currencyCode(),

    'invoiceCountryId' : tmplUtils.stringId(),
    'invoiceCountryName' : faker.address.country(),
    'invoiceCountryCode' : faker.address.countryCode(),

    'invoiceCurrencyId' : tmplUtils.stringId(),
    'invoiceCurrencyName' : faker.finance.currencyName(),
    'invoiceCurrencyCode' : faker.finance.currencyCode(),

    'owningCountryId' : tmplUtils.stringId(),
    'owningCountryName' : faker.address.country(),
    'owningCountryCode' : faker.address.countryCode(),

    'owningCurrencyId' : tmplUtils.stringId(),
    'owningCurrencyName' : faker.finance.currencyName(),
    'owningCurrencyCode' : faker.finance.currencyCode(),
};
