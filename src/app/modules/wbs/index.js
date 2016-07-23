// Styles
import './assets/styles';
// Common configs
import Configs from '../../infrastructure/configs';
// Module dependencies
import routing from './wbs.route';
import WbsText from './wbs.text';
import WbsController from './wbs.controller';
import RequestDataTransformer from './wbs-transformer.config';
import Infrastructure from '../../infrastructure';

export default angular.module('app.wbs', [ Infrastructure.name, 'ui.tree' ])
    .constant('appConfig', Configs.appConfig)
    .config(routing)
    .config(RequestDataTransformer)
    .value('WbsTextTpl', WbsText)
    .controller('WbsController', WbsController);
