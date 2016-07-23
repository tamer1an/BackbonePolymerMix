const BidManagementFactory = function (RestAbstractFactory, appConfig) {
    const service = {};

    const rest = RestAbstractFactory.create('bids');

    service.getAll = () => {
        return rest.getList();
    };

    service.one = (id) => {
        return rest.one(id);
    };

    service.post = (bid) => {
        return rest.post(bid);
    };

    service.update = (bid) => {
        if (bid.put) {
            return bid.put();
        }
        const remoteItem = RestAbstractFactory.Restangular.copy(bid);
        return remoteItem.put();
    };

    service.getClientCountries = (bid) => {
        return rest.one(bid.id).getList(appConfig.restEntities.clientCountries);
    };

    service.postClientCountry = (bid, clientCountry) => {
        return rest.one(bid.id).all(appConfig.restEntities.clientCountries).post(clientCountry);
    };

    service.updateClientCountry = (clientCountry) => {
        return clientCountry.put();
    };

    service.deleteClientCountry = (clientCountry) => {
        return clientCountry.remove();
    };

    return service;
};

export default BidManagementFactory;
