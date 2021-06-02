const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const resolvePath = (s) => {
    return path.resolve(s);
};

module.exports = (env, argv) => {
    const isProd = !!env.production; // 是否是生成环境

    const ret = {
        mode: isProd ? 'production' : 'development',
        entry: {
            app: './src/index.ts',
            // preview: './src/pages/preview/index.js',
        },
        output: {
            path: resolvePath('dist'),
            filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
            chunkFilename: isProd
                ? 'js/[name].[contenthash:8].js'
                : 'js/[name].js',
            publicPath: '/',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            alias: {
                '@': resolvePath('src'),
            },
        },
        optimization: {
            // usedExports: false,
            minimize: false,
        },
        module: {
            rules: [
                {
                    test: /\.(t|j)sx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        isProd
                            ? MiniCssExtractPlugin.loader
                            : {
                                  loader: 'style-loader',
                              },
                        {
                            loader: 'css-loader',
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        isProd
                            ? MiniCssExtractPlugin.loader
                            : {
                                  loader: 'style-loader',
                              },
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'sass-loader',
                        },
                    ],
                },
                {
                    test: /\.less$/,
                    use: [
                        isProd
                            ? MiniCssExtractPlugin.loader
                            : {
                                  loader: 'style-loader',
                              },
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'less-loader',
                        },
                    ],
                },
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 2000,
                                name: isProd
                                    ? 'img/[name]-[contenthash:8].[ext]'
                                    : 'img/[name].[ext]',
                            },
                        },
                    ],
                },
                {
                    test: /\.(ttf|svg)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000,
                                esModule: false, // 默认是TRUE
                                // name: 'fonts/'
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            // new webpack.HashedModuleIdsPlugin(), // module.id 变为 hash
            // new webpack.NamedModulesPlugin(), // 把 module.id 转为 ./src/index.js
            // new webpack.optimize.ModuleConcatenationPlugin(),
            new HtmlWebpackPlugin({
                template: 'src/index.ejs',
            }),
        ],
    };

    if (isProd) {
        ret.plugins.push(
            new MiniCssExtractPlugin({
                filename: 'css/[contenthash:8].css',
            })
        );
    }

    if (!isProd) {
        ret.devServer = {
            historyApiFallback: true,
            port: '9999',
            publicPath: '/', // 访问地址先切掉这个，在去contentBase中找
            contentBase: resolvePath('public'),
        };
    }

    return ret;
};
