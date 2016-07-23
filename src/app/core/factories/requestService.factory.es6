(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('requestServiceFactory', requestServiceFactory);

    requestServiceFactory.$inject = ['$interval', /*'$log',*/ '$location', 'Settings', 'User', '$http'];

    function requestServiceFactory($interval, /*$log,*/ $location, Settings, User, $http) {
        let protocol=$location.protocol(),
            host=$location.host(),
            port=!Settings.getEnviroment()?'3000':$location.port(),
            apiVersion = 'newapi',
            url = `${protocol}://${host}:${port}/${apiVersion}/`;

            //user = User;

        return {
            login(formData){
                return fetch(url+'users',{
                    method:'post',
                    body:  'data='+encodeURIComponent(JSON.stringify(formData)),
                    headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', Accept:'application/json, text/javascript, */*'  })
                    //credentials:'include'
                 });
            },
            vmnr : {
                 getList() {
                    return fetch(url+'config/vmnr_list');
                 }
            },
            chr : {
                getList() {
                    return fetch(url+'config/chr_list');
                },
                getListHTTP(user) {
                    debugger;

                    // `session=${user.userSession.session}&command=get_chr_list`

                    return $http({
                        url: url+'config/chr_list',
                        params: {
                            session:user.userSession.session,
                            command: 'get_chr_list'
                        }
                    });

                    //session:52f8aa77-aff0-4a8f-85f5-ee356adc9fb6
                    //command:get_vmnr_list
                    //userRecId:43890167824278862
                }
            },
            users : {
                getList() {
                    return fetch(url+'config/users/');
                }
            }
        }
    }
})();