// Styles
import './assets/styles';
// Common configs
import Configs from '../../infrastructure/configs';
import Text from './bid-management.text';
// Module dependencies
import routing from './bid-management.route';
import BidManagementController from './bid-management.controller';
//Custom configs
import RequestDataTransformer from './bid-transformer.config';
import Infrastructure from '../../infrastructure';

export default angular.module('app.bidManagement',
    [
        Infrastructure.name
    ])
    .constant('appConfig', Configs.appConfig)
    .config(routing)
    //.config(RequestDataTransformer)
    .value('textTPL', Text)
    .controller('BidManagementController', BidManagementController);
