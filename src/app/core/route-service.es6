(function() {
    'use strict';

    angular.module('app')
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
                controller: function($scope, User, requestServiceFactory, $state){
                    $scope.User = User;

                    requestServiceFactory.login({'login':'Administrator','password':'zultys'}).then(function (response) {
                        if (response.status !== 200 && response.status !== 201) {
                            console.log(`Looks like there was a problem.\n  Status Code: ${response.status}`);
                            return;
                        }
                        response.json().then((function (data) {
                            User.fullName = 'Albert Umyarov';

                            requestServiceFactory.session = data.session;
                            if (data.session){
                                $scope.User.getSession().read_commands =  data.read_commands;
                                $scope.User.getSession().session = data.session;
                                $scope.User.getSession().write_commands = data.write_commands;
                                $scope.User.getSession().is_logged = true;
                                $state.go('chr');
                            }
                        }).bind(this));
                    });
                }
            });
    }]);

    stateService.$inject = ['dynamicStates'];

    function dynamicStates($stateProvider) {
        this.$get = function() {
            return {
                addState: function(name, config) {
                    $stateProvider.state(name, config);
                }
            }
        }
    }

    function stateService(dynamicStates) {
        return dynamicStates
    }
})();
