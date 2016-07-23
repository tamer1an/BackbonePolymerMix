const appConfig = {};

appConfig.host = 'http://' + window.location.host;
appConfig.apiVersion = 'api/v1/';
appConfig.apiPort = '';
appConfig.apiBaseUrl = 'http://' + window.location.host + '/' + appConfig.apiVersion;

appConfig.api = {
    user_login: appConfig.host + 'login'
};

appConfig.restEntities = {
    bids: 'bids',
    clientCountries: 'client_countries'
};

appConfig.states = {
    login: {
        url: '/login',
        state: 'login'
    },
    bidManagement: {
        url: '/bid-management',
        state: 'bidManagement'
    },
    wbs: {
        url: '/wbs/:bidId',
        state: 'wbs'
    }
};

export default appConfig;
