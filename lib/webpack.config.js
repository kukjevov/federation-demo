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

const distPath = 'wwwroot';
const angularEntryFile = 'main.browser.bootstrap.ts';

export default [function(options, args)
{
    var prod = args && args.mode == 'production' || false;
    var hmr = !!options && !!options.hmr;
    var ssr = !!options && !!options.ssr;
    var debug = !!options && !!options.debug;
    var css = !!options && !!options.css;
    var html = !!options && !!options.html;
    var nomangle = !!options && !!options.nomangle;
    var noCache = !!options && !!options.noCache;
    var esbuild = !!options && !!options.esbuild;
    var ngsw = process.env.NGSW == 'true';

    if(!!options && options.ngsw != undefined)
    {
        ngsw = !!options.ngsw;
    }

    console.log(`Angular service worker enabled: ${ngsw}.`);

    options = options || {};

    console.log(`Running build with following configuration Production: ${prod} HMR: ${hmr} SSR: ${ssr} Debug: ${debug} CSS: ${css} HTML: ${html} NoMangle: ${nomangle} NoCache: ${noCache} EsBuild: ${esbuild}`);

    const config =
    {
        output:
        {
            globalObject: 'self',
            path: path.join(dirName, distPath),
            filename: `[name].js`,
            publicPath: 'auto',
            chunkFilename: `[name].${ssr ? 'server' : 'client'}.chunk.js`,
            assetModuleFilename: 'assets/[hash][ext][query]'
        },
        mode: 'development',
        target: ssr ? 'node' : 'web',
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
                        fullySpecified: false
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
                name: 'lib',
                filename: 'remoteEntry.js',
                exposes:
                {
                    './lib': './src/lib',
                },
                shared:
                {
                    ...sharedDependenciesLazy,
                },
            }),
            new WebpackNotifierPlugin({title: `Webpack - ${hmr ? 'HMR' : (ssr ? 'SSR' : 'BUILD')}`, excludeWarnings: true, alwaysNotify: true, sound: false}),
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
            new AngularWebpackPlugin(
            {
                tsConfigPath: path.join(dirName, 'tsconfig.json'),
                sourceMap: true,
            }),
        ],
    };

    return config;
}];
