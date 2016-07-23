const RestAbstractFactory = function (Restangular) {
    const service = {};

    service.create = (parentRoute) => {
        return Restangular.service(parentRoute);
    };

    service.createLogin = () => {
        return Restangular.one('login')
    };

    service.setToken = (token) => {
        Restangular.setDefaultHeaders(token);
    };

    return service;
};

export default RestAbstractFactory;
