const CountryFactory = function (RestAbstractFactory) {
    const service = {};

    const rest = RestAbstractFactory.create('countries');

    service.getAll = () => {
        return rest.getList();
    };

    service.one = (id) => {
        return rest.one(id).get();
    };

    service.post = (country) => {
        return rest.post(country);
    };

    service.update = (country) => {
        if (country.put) {
            return country.put();
        }
        const remoteItem = RestAbstractFactory.Restangular.copy(country);
        return remoteItem.put();
    };

    service.getCurrenciesByCountry = (countryId) => {
        return rest.one(countryId).getList('currencies');
    };

    return service;
};

export default CountryFactory;
