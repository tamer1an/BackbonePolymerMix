class WbsController {
    constructor ($stateParams, BidManagementFactory, WbsTextTpl, CountryFactory) {
        this.settings = [ 'Help', 'Exit' ];
        this.t = WbsTextTpl;
        this.BidManagementFactory = BidManagementFactory;
        this.CountryFactory = CountryFactory;
        this.bidsList = null;
        this.countriesList = [];
        this.selectedItem = null;
        this.selectedNode = null;
        this.editingItem = null;
        this.itemHierarchy = [];
        this.init($stateParams.bidId);
    }

    getItemHierarchy (nodeScope) {
        let hierarchyChain = [];
        let currentNodeScope = nodeScope;
        while (currentNodeScope !== null) {
            hierarchyChain.unshift({
                level: currentNodeScope.depth(),
                value: currentNodeScope.$modelValue
            });
            currentNodeScope = currentNodeScope.$parentNodeScope;
        }
        return hierarchyChain;
    }

    getLevelDescription (level) {
        return this.t.content.bidLevels['l' + level];
    }

    getLevelDetailsDescription (level) {
        if (!this.t.content.bidLevels['l' + level]) {
            return [];
        }
        return Object.keys(this.t.content.bidLevels['l' + level].details);
    }
    hasDetails (level) {
        return this.getLevelDetailsDescription(level).length > 0;
    }

    init (bidId) {
        this.BidManagementFactory.one(bidId).get().then((data) => {
            this.bidsList = [];
            this.bidsList.push(data);
            this.itemHierarchy = [];
            this.itemHierarchy.push({
                level: 1,
                value: data
            });
            this.selectedItem = data;
            this.BidManagementFactory.getClientCountries(data)
                .then((countries) => {
                    this.bidsList[0].clientCountries = countries;
                });
        });
        this.CountryFactory.getAll()
            .then((data) => {
                this.countriesList = data;
            });
    }

    isSelected (scope) {
        return this.selectedItem &&
            this.selectedItem === scope.$modelValue;
    }

    selectItem (scope) {
        if (this.editMode()) {
            this.cancelEditMode();
        }
        if (this.isSelected(scope)) {
            this.selectedItem = null;
            this.selectedNode = scope;
            this.itemHierarchy = [];
            this.toggleNode(scope);
        } else {
            this.selectedItem = scope.$modelValue;
            this.selectedNode = scope;
            this.itemHierarchy = this.getItemHierarchy(scope);
            if (scope.collapsed) {
                this.toggleNode(scope);
            }
        }
    }

    toggleNode (scope) {
        scope.toggle();
    }

    editMode () {
        return this.editingItem !== null;
    }

    createLevel () {
        if (this.itemHierarchy.length === 1) {
            const bid = this.itemHierarchy[0].value;
            this.editingItem = {
                'clientCountryCode': 'New Country',
                'id': '',
                'clientCountryId': '',
                'clientCurrencyId': '',

                'invoiceCountryId': '',
                'invoiceCurrencyId': '',

                'owningCountryId': '',
                'owningCurrencyId': ''
            };
            bid.clientCountries.unshift(this.editingItem);
            this.selectedItem = this.editingItem;
        }
    }

    editLevel () {
        if (this.itemHierarchy.length === 2) {
            this.editingItem = this.itemHierarchy[1].value;
        }
    }

    deleteLevel () {
        if (this.itemHierarchy.length === 2) {
            this.BidManagementFactory.deleteClientCountry(this.selectedItem);
            this.deleteItem(this.bidsList[0].clientCountries, this.selectedItem);
            this.selectedItem = this.bidsList[0];
        }
    }

    cancelEditMode () {
        this.editingItem = null;
        this.init(this.bidsList[0].id);
    }

    saveLevel () {
        const bid = this.itemHierarchy[0].value;
        const isNewItem = this.itemHierarchy.length === 1;
        if (isNewItem) {
            this.BidManagementFactory.postClientCountry(bid, this.editingItem)
                .then(() => this.init(this.bidsList[0].id));
        } else {
            this.BidManagementFactory.updateClientCountry(this.editingItem)
                .then(() => this.init(this.bidsList[0].id));
        }
        this.editingItem = null;
    }

    updateItem (itemList, oldItem, newItem) {
        const itemIndex = itemList.indexOf(oldItem);
        itemList[itemIndex] = newItem;
    }

    deleteItem (itemList, item) {
        const itemIndex = itemList.indexOf(item);
        itemList.splice(itemIndex, 1);
    }
}

export default WbsController;
