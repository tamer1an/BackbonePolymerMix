'use strict';

let _ = require('lodash');

const webpackConfigs = {
    global: require(__dirname + '/deployment-configs/webpack-configs/global'),
    production: require(__dirname + '/deployment-configs/webpack-configs/environments/production'),
    development: require(__dirname + '/deployment-configs/webpack-configs/environments/development')
};

let WebpackConfig = (enviroment) => {
//    if (!enviroment){
    //   throw new Error('Can\'t find local enviroment variable via process.env.NODE_ENV');
  //  }
  ///  if (!webpackConfigs[enviroment]){
    //   throw new Error('Can\'t find enviroment\'s. See webpackConfigs object');
   // }

   enviroment = 'development';

    return webpackConfigs && _.merge(
            webpackConfigs['global'](__dirname),
            webpackConfigs[enviroment](__dirname)
        );
    };

module.exports = WebpackConfig(process.env.NODE_ENV);
