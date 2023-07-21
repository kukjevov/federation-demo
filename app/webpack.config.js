import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import path from 'path';
import WebpackNotifierPlugin from 'webpack-notifier';
import BitBarWebpackProgressPlugin from 'bitbar-webpack-progress-plugin';
import {AngularWebpackPlugin} from '@ngtools/webpack';
import linkerPlugin from '@angular/compiler-cli/linker/babel';
import asyncGeneratorFunctions from '@babel/plugin-proposal-async-generator-functions';
import asyncToGenerator from '@babel/plugin-transform-async-to-generator';
import {dirName} from './webpack.commonjs.cjs';
import {sharedDependenciesLazy} from '../deps.cjs';

export default [function(options, args)
{
    var prod = args && args.mode == 'production' || false;

    const config =
    {
        entry:
        {
            'main': './src/bootstrap'
        },
        mode: 'development',
        target: 'web',
        optimization:
        {
            runtimeChunk: 'single',
            ...prod ? 
                {
                    splitChunks: 
                    {
                        chunks: 'all',
                    }
                } : {},
        },
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
                    use:
                    [
                        {
                            loader: 'babel-loader',
                            options:
                            {
                                plugins:
                                [
                                    asyncGeneratorFunctions,
                                    asyncToGenerator,
                                ],
                                compact: false,
                                cacheDirectory: true,
                            }
                        },
                        '@ngtools/webpack',
                    ]
                },
                {
                    test: /\.m?js$/,
                    use:
                    {
                        loader: 'babel-loader',
                        options:
                        {
                            plugins:
                            [
                                linkerPlugin,
                                asyncGeneratorFunctions,
                                asyncToGenerator,
                            ],
                            compact: false,
                            cacheDirectory: true,
                        }
                    },
                    resolve:
                    {
                        fullySpecified: false, // disable the behaviour
                    },
                },
                {
                    test: /\.html$/,
                    use: ['raw-loader']
                },
                {
                    test: /\.(ttf|woff|woff2|eot|svg|png|jpeg|jpg|bmp|gif|icon|ico)$/,
                    type: 'asset/resource'
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
                    ...sharedDependenciesLazy,
                },
            }),
            new WebpackNotifierPlugin({title: `Webpack - BUILD`, excludeWarnings: true, alwaysNotify: true, sound: false}),
            //copy external dependencies
            // new CopyWebpackPlugin(
            // {
            // }),
            new BitBarWebpackProgressPlugin(),
            new webpack.DefinePlugin(
            {
                isProduction: prod,
                jsDevMode: !prod,
                ...prod ? {ngDevMode: false} : {},
                ngI18nClosureMode: false
            }),
            new HtmlWebpackPlugin(
            {
                filename: 'index.html',
                template: path.join(dirName, 'index.html'),
                inject: 'head'
            }),
            new AngularWebpackPlugin(
            {
                tsConfigPath: path.join(dirName, 'tsconfig.json'),
                sourceMap: true,
            }),
        ],
    };

    return config;
}];
