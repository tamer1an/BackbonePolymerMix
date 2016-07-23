var App = {};
var scope;
var ctrl;

describe('User-Portal', function () {

    describe('... VmnrController', function () {

        beforeEach(module('app'));

        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            ctrl  = $controller('VmnrController', {
                $scope: scope,
                settings:{
                    checkSession (session,state) {
                        if(!session.is_logged){
                            state.go('login');
                        }
                    },
                    getEnviroment () {
                        return enviroment;
                    },
                    page:{
                        title: '',
                        icon:'',
                        breadcrumb:''
                    }
                }
            });
        }));

        it('scope should have user entity and session', inject(function () {
            expect(angular.isObject(scope.user)).toBeTruthy();
            expect(scope.user.hasOwnProperty('userSession')).toBeTruthy();
        }));

        it('should create a new rule', inject(function () {
            var newRule = scope.createNewRule(scope.user);

            expect(angular.isObject(newRule)).toBeTruthy();
        }));

        it('should generate rule description', inject(function () {
            var newRule = scope.createNewRule(scope.user),
                description = scope.createDescription(newRule);

            expect(angular.isString(description)).toBeTruthy();
            expect(description.length > 0).toBeTruthy();
        }));

        it('editState should be false by default', inject(function () {
            expect(scope.user.vmnr.editState).toBeFalsy();
        }));

        it('should able navigate to edit rule', inject(function () {
            var newRule = scope.createNewRule(scope.user);
            scope.navigateTo(newRule, false, newRule);

            expect(scope.user.vmnr.editState).toBeTruthy();
        }));

        //TODO: delete
        // it('should able to delete rule', inject(function () {
        //
        // }));
        //TODO: rule editing
        // it('should able to edit rule', inject(function () {
        //
        // }));
    });

    describe('... ChrController', function () {

        beforeEach(module('app'));

        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            ctrl  = $controller('ChrController', {
                $scope: scope,
                settings:{
                    checkSession (session,state) {
                        if(!session.is_logged){
                            state.go('login');
                        }
                    },
                    getEnviroment () {
                        return enviroment;
                    },
                    page:{
                        title: '',
                        icon:'',
                        breadcrumb:''
                    }
                }
            });
        }));

        it('scope should have user entity and session', inject(function () {
            expect(angular.isObject(scope.user)).toBeTruthy();
            expect(scope.user.hasOwnProperty('userSession')).toBeTruthy();
        }));

        it('should create a new rule', inject(function () {
            var newRule = scope.createNewRule(scope.user);

            expect(angular.isObject(newRule)).toBeTruthy();
        }));

        it('should generate rule description', inject(function () {
            var newRule = scope.createNewRule(scope.user),
                description = scope.createDescription(newRule);

            expect(angular.isString(description)).toBeTruthy();
            expect(description.length > 0).toBeTruthy();
        }));

        it('editState should be false by default', inject(function () {
            expect(scope.user.chr.editState).toBeFalsy();
        }));

        it('should able navigate to edit rule', inject(function () {
            var newRule = scope.createNewRule(scope.user);
            scope.navigateTo(newRule, false, newRule);

            expect(scope.user.chr.editState).toBeTruthy();
        }));

        //TODO: delete
        // it('should able to delete rule', inject(function () {
        //
        // }));
        //TODO: rule editing
        // it('should able to edit rule', inject(function () {
        //
        // }));
    });
});

