(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('requestServiceFactory', requestServiceFactory);

    requestServiceFactory.$inject = ['$interval', '$log'];

    function requestServiceFactory($interval, $log) {
        let protocol=location.protocol,
            host=location.hostname,
            port=':7070',
            apiVersion = '/newapi/',
            url = [protocol,'//',host,port,apiVersion].join('');

        return {
            calc : {
                 getList() {
                    return fetch(url+'config/vmnr_list'/*,{
                        credentials:'include'
                    }*/);
                 }
            }
        }
    }
})();