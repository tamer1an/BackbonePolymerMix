(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('RequestServiceFactory', RequestServiceFactory);

    RequestServiceFactory.$inject = ['$location', 'Settings'];

    function RequestServiceFactory($location, Settings) {
        let protocol=$location.protocol(),
            host=$location.host(),
            port=!Settings.getEnviroment()?'3000':$location.port(),
            apiVersion = 'newapi',
            url = `${protocol}://${host}:${port}/${apiVersion}/`,
            postHeaders = new Headers({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept':'application/json, text/javascript, */*'
            });

        return {
            login(formData){
                return fetch(url+'users',{
                    method:'post',
                    body:  'data='+encodeURIComponent(JSON.stringify(formData)),
                    headers: postHeaders                    //credentials:'include'
                 });
            },
            vmnr : {
                createRule(rule,user){
                    return fetch(url+'vmnr/add',{
                        method: 'post',
                        body:  'session='+user.userSession.session
                            +  '&command=add_user_vmnr'
                            +  '&data='+encodeURIComponent(JSON.stringify(rule)),

                        headers: new Headers({
                            'Accept':'application/json, text/javascript, */*'
                        })
                    });
                },
                getList(user) {
                     return fetch(url+
                         `vmnr/vmnr_list?command=get_user_vmnr_list&session=${user.userSession.session}`
                     );
                },
                saveRule(rule,user) {
                    delete rule.$$hashKey;
                    return fetch(url+'vmnr/update',{
                        method: 'post',
                        body:  'session='+user.userSession.session
                            +  '&command=update_user_vmnr'
                            +  '&data='+encodeURIComponent(JSON.stringify(rule)),

                        headers: new Headers({
                            'Accept':'application/json, text/javascript, */*'
                        })
                    });
                },
                deleteRule(rule,user) {
                    return fetch(url+'vmnr/delete',{
                        method: 'post',
                        body:  'session='+user.userSession.session
                            +  '&command=delete_user_vmnr'
                            +  '&data='+encodeURIComponent(JSON.stringify({ruleId:rule.ruleId})),

                        headers: new Headers({
                            'Accept':'application/json, text/javascript, */*'
                        })
                    });
                }
            },
            chr : {
                createRule(rule,user){
                    return fetch(url+'chr/add',{
                        method: 'post',
                        body:  'session='+user.userSession.session
                        +  '&command=add_user_chr'
                        +  '&data='+encodeURIComponent(JSON.stringify(rule)),

                        headers: new Headers({
                            'Accept':'application/json, text/javascript, */*'
                        })
                    });
                },
                getList(user) {
                    return fetch(url+
                       `config/chr_list?command=get_user_chr_list&session=${user.userSession.session}`
                    );
                },
                saveRule(rule,user) {
                    delete rule.$$hashKey;
                    return fetch(url+'chr/update',{
                        method: 'post',
                        body:  'session='+user.userSession.session
                                +  '&command=update_user_chr'
                                +  '&data='+encodeURIComponent(JSON.stringify(rule)),

                        headers: new Headers({
                            'Accept':'application/json, text/javascript, */*'
                        })
                    });
                },
                deleteRule(rule,user){
                    return fetch(url+'chr/delete',{
                        method: 'post',
                        body:  'session='+user.userSession.session
                                +  '&command=delete_user_chr'
                                +  '&data='+encodeURIComponent(JSON.stringify(rule)),

                        headers: new Headers({
                            'Accept':'application/json, text/javascript, */*'
                        })
                    });
                }
            },
            users : {
                getList(user) {
                    return fetch(url+
                        `config/users?command=get_address_book&session=${user.userSession.session}`
                    );
                }
            }
        }
    }
})();