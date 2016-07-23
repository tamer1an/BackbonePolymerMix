import BidManagementController from './bid-management.controller';

import BidManagementTemplate from './assets/templates/bid-management.tpl.jade';
import ContentTemplate from './assets/templates/bids.content.tpl.jade';
import HeaderTemplate from './assets/templates/bids.header.tpl.jade';
import SidebarTemplate from './assets/templates/bids.sidebar.tpl.jade';

export default function ($stateProvider, appConfig) {
    const moduleViews = {
        '': {
            template: BidManagementTemplate,
            controller: BidManagementController,
            controllerAs: 'bidCtrl'
        }
    };

    moduleViews[`sidebar@${appConfig.states.bidManagement.state}`] = {
        template: SidebarTemplate
    };
    moduleViews[`content@${appConfig.states.bidManagement.state}`] = {
        template: ContentTemplate
    };
    moduleViews[`header@${appConfig.states.bidManagement.state}`] = {
        template: HeaderTemplate
    };

    $stateProvider
        .state(appConfig.states.bidManagement.state, {
            url: appConfig.states.bidManagement.url,
            views: moduleViews,
            resolve: {
                bidsList (BidManagementFactory) {
                    return BidManagementFactory.getAll();
                }
            }
        });
}
