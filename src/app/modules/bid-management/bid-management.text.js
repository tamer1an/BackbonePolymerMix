import Configs from '../../infrastructure/configs';

let BidManagementText = {
    bidActions: {
        create: 'Create Bid',
        open: 'Open Bid',
        add: 'Add New Version',
        clone: 'Clone',
        archive: 'Archive',
        delete: 'Delete Bid'
    },
    sidebar: {
        header: 'Bids List',
        col1: 'Bid Name and Description',
        col2: 'Owner',
        col3: 'Created'
    },
    content: {
        bidDetails: {
            header: 'Bid Details',
            edit: 'Edit',
            save: 'Save',
            cancel: 'Cancel'
        },
        salesforce: {
            header: 'Saleforce',
            label: 'Use Salesforce ID',
            yes: 'Yes',
            no: 'No'
        },
        bidLevels: {
            header: 'Bid Levels',
            countryLabel: 'Client Country',
            l1: {
                label: 'L1',
                name: 'Bid Name',
                addCountry: '+ Add New Country'
            },
            l2: {
                label: 'L2',
                clientCountry: 'Client Country',
                clientCurrency: 'Сlient Currency',
                invoiceCountry: 'Invoice Country',
                invoiceCurrency: 'Invoice Currency',
                owningCountry: 'Owning Country',
                owningCurrency: 'Owning Currency',
                newCountry: '+ Add New Country',
                deleteCountry: '- Delete Country'
            }
        },
        bidInfo: {
            header: 'Bid Dates and Description',
            start: 'Start Date',
            end: 'End Date',
            duration: 'Duration',
            label: 'months',
            description: 'Description'
        }
    },
    messages: {
        emptyList: 'There are no Bids yet. You can create new one clicking the \'Create Bid\' button on action bar.',
        noSelect: 'No Bids Selected',
        multiSelect: 'Bids are selected',
        success: 'New bid has been successfully created.'
    }
};
export default Object.assign(BidManagementText, Configs.textTemplate);
