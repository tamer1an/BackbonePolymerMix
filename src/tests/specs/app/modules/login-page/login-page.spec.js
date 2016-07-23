// Import the controller to be tested
import LoginPageController from '../../../../../app/modules/login-page/login-page.controller.js';

describe('[modules] LoginPageController class', () => {

    let $rootScope, vm;

    beforeEach(angular.mock.inject((_$rootScope_, _$controller_) => {

        $rootScope = _$rootScope_.$new();

        vm = new LoginPageController();
        //vm = _$controller_(LoginPageController, {});
    }));

    it('should be test data', () => {
        expect(vm.testValue1).toBeUndefined();
        vm.testData();
        console.log(vm.testValue1);
        expect(vm.testValue1).toBe(12333);
    });
});
