const TextPlugin = require('extract-text-webpack-plugin'),
    autoprefixer = require('autoprefixer'),
    join = require('path').join;

module.exports = (_path) => {
    const rootAssetPath = join(_path, 'src/app');

    return {
        external: {
            'angular': 'angular'
        },
        entry: {
            app: [ join(_path, 'src', 'app', 'app.js'), 'angular-ui-tree' ]
        },
        output: {
            path: join(_path, 'build'),
            filename: join('assets', 'js', '[name].bundle.js'),
            publicPath: '../../',
            hotUpdateMainFilename: 'updates/[hash].update.json',
            hotUpdateChunkFilename: 'updates/[hash].[id].update.js'
        },
        context: join(_path, 'src'),
        devtool: 'inline-source-map',
        resolveLoader: {
            root: join(_path, 'node_modules')
        },
        resolve: {
             //extensions: [ '', '.jade', '.css', '.sass', '.scss', '.js' ],
            modulesDirectories: [ 'node_modules' ],
            alias: {
                'angular-ui-tree': join(_path, 'node_modules/angular-ui-tree/dist/angular-ui-tree.min.js')
            }
        },
        module: {
            postLoaders: [
                {
                    test: /angular(\.js | \.min\.js)$/,
                    loader: 'script!' + join(_path, 'node_modules/angular-ui-tree/dist/angular-ui-tree.min.js')
                }
            ],
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'ng-annotate!babel-loader'
                },
                {
                    test: /\.jade$/,
                    loader: 'jade-loader'
                },
                {
                    test: /\.scss$/,
                    loader: TextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader?sourceMap')
                },
                {
                    test: /\.css$/,
                    loader: TextPlugin.extract('style-loader', 'css-loader!postcss-loader?sourceMap')
                },
                {
                    test: /\.(ttf|eot|woff|woff2|png|ico|jpg|jpeg|gif|svg)$/i,
                    loaders: [ 'file?context=' + rootAssetPath + '&name=assets/static/[ext]/[name].[ext]?[hash]' ]
                }
            ]
        },
        postcss: [ autoprefixer({ browsers: [ 'last 2 versions' ] }) ]
    };
};
