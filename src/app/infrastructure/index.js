import Factories from './factories';
import Directives from './directives';

export default angular.module('app.infrastructure', [])
    .factory('AuthService', Factories.AuthService)
    .factory('RestAbstractFactory', Factories.RestAbstractFactory)
    .factory('CountryFactory', Factories.CountryFactory)
    .factory('BidManagementFactory', Factories.BidManagementFactory)
    .directive('sidebarStyling', Directives.sidebarStyling)
    .directive('countryForm', () => new Directives.CountryDirective())
    .directive('a', () => new Directives.AnchorDirective());
