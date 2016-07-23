// Import styles
import './styles.import';
// Dependencies
import Dependencies from './dependencies.import';
// Application configs
import Configs from './infrastructure/configs';
// Application modules, where Infrastructure -> main module
import Infrastructure from './infrastructure';
import Modules from './modules';

angular
    .module('app', [
        Dependencies.angularMaterial,
        Dependencies.angularAnimate,
        Dependencies.angularUIRouter,
        Dependencies.materialIcons,
        'restangular',
        Infrastructure.name,
        Modules.LoginPageModule.name,
        Modules.BidManagementModule.name
    ])
    .constant('appConfig', Configs.appConfig)
    .config(Configs.routerConfig)
    .config(Configs.themeConfig)
    .config(Configs.restConfig)
    .run(Configs.runConfig);
