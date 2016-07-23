const LoginPageFactory = function (RestAbstractFactory) {
    const service = {};

    const rest = RestAbstractFactory.createLogin();

    service.post = (credentials) => {
         return rest.customPOST(
            `userName=${credentials.name}&password=${credentials.password}&grant_type=password`,
            '',
            {},
            {
                'Content-Type':'application/x-www-form-urlencoded'
            }
        );
    };

    service.setToken = (token) => {
        RestAbstractFactory.setToken(token);
    };

    return service;
};

export default LoginPageFactory;
