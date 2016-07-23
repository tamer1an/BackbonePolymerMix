'use strict';

let webpack = require('webpack'),
    jade = require('jade'),
    ngAnnotatePlugin = require('ng-annotate-webpack-plugin'),
    TextPlugin = require('extract-text-webpack-plugin'),
    HtmlPlugin = require('html-webpack-plugin'),
    join = require('path').join;

module.exports = (_path) => {
    const dependencies = Object.keys(require(_path + '/package').dependencies);

    return {
        debug: false,
        entry: {
            vendors: dependencies
        },
        output: {
            chunkFilename: '[id].bundle.js'
        },
        plugins: [
            new ngAnnotatePlugin({ add: true }),
            new HtmlPlugin({
                title: 'CSC - A global leader in providing technology enabled business solutions and services',
                chunks: [ 'app', 'vendors' ],
                filename: 'index.html',
                templateContent: function (templateParams, compilation) {
                    var indexTemplate = join(_path, '/src/index.jade');
                    compilation.fileDependencies.push(indexTemplate);
                    return jade.compileFile(indexTemplate)();
                }
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new TextPlugin('assets/css/[name].bundle.css', { disable: false, allChunks: true }),
            new webpack.optimize.CommonsChunkPlugin('vendors', 'assets/js/[name].bundle.js'),
            new webpack.BannerPlugin(['/**', 'CSC.GET', ' **/'].join('\n'), {raw: true}),
            new webpack.optimize.AggressiveMergingPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurenceOrderPlugin(true),
            new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                compress: {drop_console: true},
                output: {comments: false}
            }),
            new webpack.NoErrorsPlugin()
        ]
    }
};
