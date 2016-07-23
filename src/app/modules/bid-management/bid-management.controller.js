class BidManagementController {
    constructor (textTPL, bidsList, $state, $mdDialog, BidManagementFactory, CountryFactory) {
        this.BidManagementFactory = BidManagementFactory;
        this.CountryFactory = CountryFactory;
        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.t = textTPL;
        this.bidsList = bidsList;
        this.selectedBids = [];
        this.selectedBid = {};
        this.editMode = false;
        this.editedBidCopy = {};
        this.sortType = '';
        this.sortReverse = false;
        this.saveBidDisabled = false;
        this.countriesList = [];

        if (!this.countriesList.length) {
            this.populateCountriesList();
        }
    }
    selectBid (bid) {
        this.editMode = false;
        // bid.selected = !bid.selected;//TODO:refactor model
        this.bidsList.forEach((bid) => bid.selected = false);
        bid.selected = !bid.selected;
        // this.selectedBids = this.bidsList.filter((bid) => bid.selected);
        if (this.selectedBids.length) {
            this.selectedBids.pop();
        }
        this.selectedBids.push(bid);

        if (bid.selected) {
            this.selectedBid = bid;
        } else if (this.selectedBids.length === 1) {
            this.selectedBid = this.selectedBids[0];
        }
        if (_.isEqual(this.selectedBids.length, 1) &&
            this.selectedBids[0].id) {
            this.BidManagementFactory.getClientCountries(this.selectedBids[0])
                .then((data) => {
                    this.selectedBids[0].clientCountries = angular.isArray(data)?data:[];
                });
        }
    }
    selected () {
        return !_.isEqual(this.selectedBids.length, 0);
    }
    noSelection () {
        return _.isEqual(this.selectedBids.length, 0);
    }
    singleSelection () {
        return _.isEqual(this.selectedBids.length, 1) && this.selectedBid.id;
    }
    multipleSelection () {
        return this.selectedBids.length > 1;
    }
    bidCreation () {
        return _.isEqual(this.selectedBids.length, 1) && !this.selectedBid.id;
    }
    createBid () {
        this.bidsList.unshift({
            'name': 'New Bid',
            'description': '',
            'startDate': '',
            'endDate': '',
            'creationDate': new Date(),
            'clientCountries': [ this.getEmptyClientCountry() ]
        });

        this.selectBid(this.bidsList[0]);
    }
    cancelBidCreation () {
        this.bidsList.splice(this.bidsList.indexOf(this.selectedBid), 1);
        this.selectedBids = [];
    }
    saveNewBid () {
        let selectedBid = angular.copy(this.selectedBid);
        delete this.selectedBids[0].selected;
        this.saveBidDisabled = true;
        this.BidManagementFactory.post(selectedBid).then(() => {
            this.refreshBidsList();
        }, () => {
            this.saveBidDisabled = false;
        });
    }
    formatBidsDate (date) {
        return new Date(date.toString());
    }
    calculateDuration () {
        var duration;
        duration = Math.abs(Math.floor(moment(this.selectedBids[0].startDate)
            .diff(moment(this.selectedBids[0].endDate), 'months', true)));
        this.selectedBids[0].duration = duration ? duration : 0;
    }
    setEditMode () {
        this.editMode = true;
        this.editedBidCopy = angular.copy(this.selectedBids[0]);
        this.selectedBids[0].startDate = this.formatBidsDate(this.selectedBids[0].startDate);
        this.selectedBids[0].endDate = this.formatBidsDate(this.selectedBids[0].endDate);
    }
    saveEditedBid () {
        let selectedBid = angular.copy(this.selectedBids[0]);
        delete selectedBid.selected;
        selectedBid.startDate = this.selectedBids[0].startDate.toString();
        selectedBid.endDate = this.selectedBids[0].endDate.toString();
        this.saveBidDisabled = true;
        this.BidManagementFactory.update(selectedBid).then(() => {
            this.refreshBidsList();
        }, () => {
            this.saveBidDisabled = false;
        });
    }
    refreshBidsList () {
        return this.BidManagementFactory.getAll().then((bidsList) => {
            this.bidsList = angular.isArray(bidsList)?bidsList:[];
            this.selectedBids = [];
            this.selectedBid = {};
            this.editMode = false;
            this.saveBidDisabled = false;
        });
    }
    cancelBidEditing () {
        this.selectedBids[0] = angular.copy(this.editedBidCopy);
        this.editedBidCopy = {};
        this.editMode = false;
    }
    addNewCountry () {
        if (!this.selectedBids[0].clientCountries) {
            this.selectedBids[0].clientCountries = [];
        }
        this.selectedBids[0].clientCountries.push(this.getEmptyClientCountry());
    }
    deleteCountry (ev, index) {
        if (index > -1) {
            var array = this.selectedBids[0].clientCountries;
            var item = array[index];
            var countryName = item.clientCountryName;
            var confirm = this.$mdDialog.confirm()
                .title('Would you like to delete existing `Client Country` from the Bid?')
                .content('You are trying to delete <strong>' + countryName + '</strong>. Client Country and all folders below will be deleted.')
                .ariaLabel('delete-client-country')
                .targetEvent(ev)
                .ok('Confirm')
                .cancel('Cancel');

            this.$mdDialog.show(confirm).then(function() {
                array.splice(index, 1);
            }, function() {
            });
        }
    }
    addBidNewVersion () {

    }
    cloneBid () {

    }
    arhiveBid () {

    }
    deleteBid () {

    }
    openBid () {
        this.$state.go('wbs', { bidId: this.selectedBid.id });
    }
    orderByCreationDate () {
        this.sortType = 'creationDateAsDate';
        this.sortReverse = !this.sortReverse;
    }
    populateCountriesList () {
        this.CountryFactory.getAll()
        .then((data) => {
            this.countriesList = data;
        });
    }
    getEmptyClientCountry () {
        return {
            'id': '',
            'clientCountryId': '',
            'clientCurrencyId': '',

            'invoiceCountryId': '',
            'invoiceCurrencyId': '',

            'owningCountryId': '',
            'owningCurrencyId': ''
        };
    }
}

export default BidManagementController;
