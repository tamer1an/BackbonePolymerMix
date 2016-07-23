// Import the controller to be tested
import WbsController from '../../../../../app/modules/wbs/wbs.controller.js';

describe('[modules] WbsController class', () => {

    let $rootScope, vm;

    beforeEach(angular.mock.inject((_$rootScope_, _$controller_) => {

        $rootScope = _$rootScope_.$new();

        vm = new WbsController();
        //vm = _$controller_(LoginPageController, {});
    }));
});
