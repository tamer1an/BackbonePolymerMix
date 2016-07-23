// Import the controller to be tested
import CountryDirective from '../../../../../../app/infrastructure/directives/country/country.directive';

describe('[infrastructure] CountryDirective class', () => {

    let $rootScope, vm;

    beforeEach(angular.mock.inject((_$rootScope_, _$controller_) => {

        $rootScope = _$rootScope_.$new();

        vm = _$controller_(CountryDirective, {});
    }));

    it('should be initialized with properties', () => {
        console.log('[infrastructure] CountryDirective class');
        console.log(vm.restrict);
        expect(vm.restrict).toBe('E');

        console.log(vm.controllerAs);
        expect(vm.controllerAs).toBe('countyCtrl');
    });
});

