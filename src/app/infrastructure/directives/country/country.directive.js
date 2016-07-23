import CountryController from './country.controller.js';

class CountryDirective {
    constructor () {
        this.template = require('./country.tpl.jade');
        this.restrict = 'E';
        this.controller = CountryController;
        this.controllerAs = 'countyCtrl';
        this.scope = {
            currencyDisabled: '=currencyDisabled',
            clientCountry: '=clientCountry',
            countriesList: '=countriesList'
        };
    }

}

export default CountryDirective;
