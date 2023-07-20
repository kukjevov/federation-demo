const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const path = require('path');
const sharedDependencies = require('../deps.cjs');

module.exports =
{
    entry:
    {
        'main': './src/app'
    },
    mode: 'development',
    target: 'web',
    output:
    {
        globalObject: 'self',
        path: path.join(__dirname, 'wwwroot'),
        filename: `[name].js`,
        publicPath: 'auto',
        chunkFilename: `[name].chunk.js`,
        assetModuleFilename: 'assets/[hash][ext][query]'
    },
    resolve: 
    {
        extensions: [".ts", ".mjs", ".js"],
        mainFields: ['esm2022', 'es2022', 'esm2020', 'esm2015', 'es2015', 'jsnext:main', 'browser', 'module', 'main'],
        conditionNames: ['esm2022', 'es2022', 'esm2020', 'es2015', 'import']
    },
    module: 
    {
        rules: 
        [
            {
                test: /\.([cm]?ts|tsx)$/,
                loader: "ts-loader"
            },
            {
                test: /\.m?js$/,
                resolve: 
                {
                    fullySpecified: false, // disable the behaviour
                },
            },
        ]
    },
    plugins:
    [
        new ModuleFederationPlugin(
        {
            name: 'main',
            shared:
            {
                ...sharedDependencies,
            },
        }),
        new HtmlWebpackPlugin(),
    ],
};
