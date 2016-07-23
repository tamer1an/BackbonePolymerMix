import RestAbstractFactory from './rest.factory';
import CountryFactory from './country.factory';
import BidManagementFactory from './bid-management.factory';

const Factories = {
    // DataService Factory
    RestAbstractFactory: RestAbstractFactory,
    CountryFactory: CountryFactory,
    BidManagementFactory: BidManagementFactory
};

export default Factories;
