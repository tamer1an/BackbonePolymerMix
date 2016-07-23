import Configs from '../../infrastructure/configs';

const WbsText = {
    wbsActions: {
        allLevels: 'All levels',
        addSubfolder: 'Add Subfolder',
        copyTo: 'Copy To',
        moveTo: 'Move To',
        edit: 'Edit',
        delete: 'Delete'
    },
    sidebar: {
        header: 'Bid Tree'
    },
    content: {
        header: 'WBS Structure',
        bidDetails: {
            save: 'Save',
            cancel: 'Cancel'
        },
        bidLevels: {
            header: 'Hierarchy',
            l1: {
                label: 'L1',
                name: 'Bid Name',
                details: { },
                buttons: { }
            },
            l2: {
                label: 'L2',
                name: 'Client Country',
                details: {
                    clientCurrencyName: 'Client Currency',
                    invoiceCountryName: 'Invoice Country',
                    invoiceCurrencyName: 'Invoice Currency',
                    owningCountryName: 'Owning Country',
                    owningCurrencyName: 'Owning Currency'
                }
            }
        },
        bidInfo: {
            header: 'Bid Dates and Description',
            start: 'Start Date',
            end: 'End Date',
            duration: 'Duration',
            label: 'months'
        }
    }
};

export default Object.assign(WbsText, Configs.textTemplate);
