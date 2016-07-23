(function() {
    'use strict';

    angular.module('app.core')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/login');
        })
        .provider('dynamicStates', dynamicStates)
        .factory('stateService', stateService)
        .run(['stateService', function(stateService) {
            const stateName = ['login','post'];

            stateService.addState(stateName[0], {
                url: `/${stateName[0]}`,
                templateUrl: `app/core/components/${stateName[0]}.tpl.html`,
                controller:function($scope,Settings,User,$state){
                    if(User.getSession().is_logged){
                        $state.go('chr');
                    }
                },
                resolve:{
                    settings : function(Settings) {
                        Settings.page.title = 'User Portal';
			            Settings.page.icon = 'mdi-google-circles-communities';
                        return Settings;
                    }
                }
            });

            stateService.addState(stateName[1], {
                url: `/${stateName[1]}`,
                params:{
                    pass: ''
                },
                controller: function($scope, User, RequestServiceFactory, $state){
                    $scope.User = User;
                    RequestServiceFactory.login({'userLogin':User.userEntity.login,'password':$state.params.pass}).then(function (response) {
                        if (response.status !== 200 && response.status !== 201) {
                            console.log(`Looks like there was a problem.\n  Status Code: ${response.status}`);

                            $state.go('login');
                            return;
                        }
                        response.json().then((function (data) {
                            data.error? $state.go('login') : null;
                            User.fullName = $scope.User.userEntity.login;



                            RequestServiceFactory.session = data.session;
                            if (data.session){

                                $scope.User.getSession().read_commands  = data.read_commands;
                                $scope.User.getSession().session        = data.session;
                                $scope.User.getSession().write_commands = data.write_commands;
                                $scope.User.getSession().is_logged      = true;

                                RequestServiceFactory.users.getList($scope.User)
                                    .then((function(response){
                                        if (response.status !== 200) {
                                            console.log(`Looks like there was a problem. Status Code: ${response.status}`);
                                            return;
                                        }
                                        response.json().then((function(data) {
                                            this.User.addressBook = data.addressBook;
                                            this.$apply();
                                        }).bind(this));
                                    }).bind($scope))
                                    .catch(err => console.log('Fetch Error :-S', err));

                                $state.go('chr');
                            }
                        }).bind(this));
                    });
                }
            });
    }]);

    stateService.$inject = ['dynamicStates'];

    function dynamicStates($stateProvider) {
        const definedStates = {};
        this.$get = function() {
            return {
                addState: function(name, config) {
                    if(definedStates.hasOwnProperty(name))
                        return;

                    definedStates[name] = config;
                    $stateProvider.state(name, config);
                }
            }
        }
    }

    function stateService(dynamicStates) {
        return dynamicStates
    }
})();
