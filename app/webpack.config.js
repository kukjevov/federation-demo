import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import path from 'path';
import {AngularWebpackPlugin} from '@ngtools/webpack';
import {dirName} from './webpack.commonjs.cjs';
import sharedDependencies from '../deps.cjs';

export default
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
        path: path.join(dirName, 'wwwroot'),
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
                test: /\.ts$/,
                loader: "@ngtools/webpack"
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
        new webpack.container.ModuleFederationPlugin(
        {
            name: 'main',
            shared:
            {
                ...sharedDependencies,
            },
        }),
        new HtmlWebpackPlugin(),
        new AngularWebpackPlugin(
        {
            tsConfigPath: path.join(dirName, 'tsconfig.json'),
            sourceMap: true,
        }),
    ],
};
