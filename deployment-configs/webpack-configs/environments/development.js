'use strict';

let jade = require('jade'),
    webpack = require('webpack'),
    join = require('path').join,

    HtmlPlugin = require('html-webpack-plugin'),
    TextPlugin = require('extract-text-webpack-plugin'),
    ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = (_path) => {
    return {
        debug: true,
        plugins: [
            new ngAnnotatePlugin({ add: true }),
            new TextPlugin('assets/css/[name].css', { disable: false, allChunks: true }),
            new HtmlPlugin({
                title: 'CSC - A global leader in providing technology enabled business solutions and services',
                chunks: [ 'app', 'vendors' ],
                filename: 'index.html',
                templateContent: function (templateParams, compilation) {
                    var indexTemplate = join(_path, '/src/index.jade');
                    compilation.fileDependencies.push(indexTemplate);
                    return jade.compileFile(indexTemplate, {pretty: true})();
                }
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        ]
    }
};
