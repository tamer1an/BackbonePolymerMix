import WbsController from './wbs.controller';
import WbsTemplate from './assets/templates/wbs.tpl.jade';
import WbsSidebarTemplate from './assets/templates/wbs.sidebar.tpl.jade';
import WbsContentTemplate from './assets/templates/wbs.content.tpl.jade';
import WbsHeaderTemplate from './assets/templates/wbs.header.tpl.jade';

function routing ($stateProvider, appConfig) {
    let moduleViews = {
        '': {
            template: WbsTemplate,
            controller: WbsController,
            controllerAs: 'wbsCtrl'
        }
    };
    moduleViews[`sidebar@${appConfig.states.wbs.state}`] = {
        template: WbsSidebarTemplate
    };
    moduleViews[`content@${appConfig.states.wbs.state}`] = {
        template: WbsContentTemplate
    };
    moduleViews[`header@${appConfig.states.wbs.state}`] = {
        template: WbsHeaderTemplate
    };
    $stateProvider
        .state(appConfig.states.wbs.state, {
            url: appConfig.states.wbs.url,
            views: moduleViews
        });
}

export default routing;
