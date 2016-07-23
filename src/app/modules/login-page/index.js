// Styles
import './assets/login-page.scss';
// Common configs
import Configs from '../../infrastructure/configs';
// Module dependencies
import routing from './login-page.route';
import LoginPageController from './login-page.controller';
import LoginPageFactory from './login-page.factory';

export default angular.module('app.login', [])
    .constant('appConfig', Configs.appConfig)
    .config(routing)
    .controller('LoginPageController', LoginPageController)
    .factory('LoginPageFactory', LoginPageFactory);

