import LoginPageController from './login-page.controller';
import LoginPageTemplate from './assets/login-page.tpl.jade';

function routing ($stateProvider, appConfig) {
    $stateProvider
        .state(appConfig.states.login.state, {
            url: appConfig.states.login.url,
            template: LoginPageTemplate,
            controller: LoginPageController,
            controllerAs: 'login'
        });
}

export default routing;
