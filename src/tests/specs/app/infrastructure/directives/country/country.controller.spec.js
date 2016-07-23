// Import the controller to be tested
import CountryController from '../../../../../../app/infrastructure/directives/country/country.controller';

describe('[infrastructure] CountryController class', () => {

    let $rootScope, vm;

    beforeEach(angular.mock.inject((_$rootScope_, _$controller_) => {

        $rootScope = _$rootScope_.$new();

        vm = new CountryController();
    }));

    it('should be client country data', () => {
        console.log('[infrastructure] CountryController class');
        console.log(vm.clientCountry.items[0].countryName);
        expect(vm.clientCountry.items.length).toBe(10);
        expect(vm.clientCountry.items[0].countryName).toBe('EU');
        expect(vm.clientCountry.items[0].currencyCode).toBe('AFA23');
    });
});
