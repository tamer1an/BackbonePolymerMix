class CountryController {
    constructor ($scope, CountryFactory) {
        $scope.clientCountry = $scope.clientCountry || {};
        this.$scope = $scope;
        this.CountryFactory = CountryFactory;
        this.countriesList = this.$scope.countriesList;

        let currencyDisabled = this.$scope.currencyDisabled;

        this.clientCountry = {
            name: 'clientCountry',
            currencyName: 'clientCurrency',
            searchText: ''
        };
        this.clientCountry.selectedItem = this.getSelectedCountry(this.clientCountry.name);

        this.clientCurrency = {
            name: 'clientCurrency',
            isDisabled: currencyDisabled || !this.clientCountry.selectedItem,
            noCache: true,
            searchText: ''
        };
        this.clientCurrency.selectedItem = this.getSelectedCurrecy(this.clientCurrency.name);

        this.invoiceCountry = {
            name: 'invoiceCountry',
            currencyName: 'invoiceCurrency',
            searchText: ''
        };
        this.invoiceCountry.selectedItem = this.getSelectedCountry(this.invoiceCountry.name);

        this.invoiceCurrency = {
            name: 'invoiceCurrency',
            isDisabled: currencyDisabled || !this.invoiceCountry.selectedItem,
            noCache: true,
            searchText: ''
        };
        this.invoiceCurrency.selectedItem = this.getSelectedCurrecy(this.invoiceCurrency.name);

        this.owningCountry = {
            name: 'owningCountry',
            currencyName: 'owningCurrency',
            searchText: ''
        };
        this.owningCountry.selectedItem = this.getSelectedCountry(this.owningCountry.name);

        this.owningCurrency = {
            name: 'owningCurrency',
            isDisabled: currencyDisabled || !this.owningCountry.selectedItem,
            noCache: true,
            searchText: ''
        };
        this.owningCurrency.selectedItem = this.getSelectedCurrecy(this.owningCurrency.name);
    }

    searchTextChange (text) {
    }

    selectedCountryChange (item, country) {
        if (item) {
            this.$scope.clientCountry[`${country.name}Id`] = item.id;
            if (!item.primaryCurrency) {
                this.getCurrencyByCountry(item, country);
            } else {
                this.selectedCurrencyChange(item.primaryCurrency, country.currencyName);
            }

            if (country === this.clientCountry) {
                if (!this.invoiceCountry.selectedItem) {
                    this.selectedCountryChange(item, this.invoiceCountry);
                }
                if (!this.owningCountry.selectedItem) {
                    this.selectedCountryChange(item, this.owningCountry);
                }
            }
        } else {
            this[country.currencyName].selectedItem = null;
            this[country.currencyName].searchText = '';
        }
        country.selectedItem = item;
        this[country.currencyName].isDisabled = !item;
    }

    selectedCurrencyChange (item, currencyProp) {
        if (item) {
            this[currencyProp].selectedItem = item;
            this.$scope.clientCountry[`${currencyProp}Id`] = item.id;
        }
    }

    countryQuerySearch (query) {
        return query ? this.countriesList.filter(this.createCountryFilter(query)) : this.countriesList;
    }

    currencyQuerySearch (currency, country) {
        let items = [],
            query = currency.searchText;

        if (country && country.currencies && country.currencies.length) {
            items = query ? country.currencies.filter(this.createCurrencyFilter(query)) : country.currencies;
        }

        return items;
    }

    getCurrencyByCountry (country, countryField) {
        this.CountryFactory.getCurrenciesByCountry(country.id)
        .then((data) => {
            country.currencies = data;
            country.primaryCurrency = data[0];
            this.selectedCurrencyChange(country.primaryCurrency, countryField.currencyName);
        });
    }

    createCountryFilter (query) {
        let lowercaseQuery = angular.lowercase(query);

        return function countryFilterFn (item) {
            let lowercaseCountryName = angular.lowercase(item.countryName),
                lowercaseCountryCode = angular.lowercase(item.countryCode);

            return lowercaseCountryName.startsWith(lowercaseQuery) || lowercaseCountryCode.startsWith(lowercaseQuery);
        };
    }

    createCurrencyFilter (query) {
        let lowercaseQuery = angular.lowercase(query);

        return function currencyFilterFn (item) {
            return angular.lowercase(item.currencyCode).startsWith(lowercaseQuery);
        };
    }

    getSelectedCountry (countryName) {
        return this.$scope.clientCountry[`${countryName}Id`] ? {
            id: this.$scope.clientCountry[`${countryName}Id`] || '',
            countryName: this.$scope.clientCountry[`${countryName}Name`] || '',
            countryCode: this.$scope.clientCountry[`${countryName}Code`] || ''
        } : null;
    }

    getSelectedCurrecy (currencyName) {
        return this.$scope.clientCountry[`${currencyName}Id`] ? {
            id: this.$scope.clientCountry[`${currencyName}Id`] || '',
            currencyName: this.$scope.clientCountry[`${currencyName}Name`] || '',
            currencyCode: this.$scope.clientCountry[`${currencyName}Code`] || ''
        } : null;
    }
}

export default CountryController;
