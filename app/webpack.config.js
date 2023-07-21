import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import path from 'path';
import WebpackNotifierPlugin from 'webpack-notifier';
import BitBarWebpackProgressPlugin from 'bitbar-webpack-progress-plugin';
import {AngularWebpackPlugin} from '@ngtools/webpack';
import linkerPlugin from '@angular/compiler-cli/linker/babel';
import asyncGeneratorFunctions from '@babel/plugin-proposal-async-generator-functions';
import asyncToGenerator from '@babel/plugin-transform-async-to-generator';
import {HmrLoader} from '@angular-devkit/build-angular/src/tools/webpack/plugins/hmr/hmr-loader.js';
import {dirName} from './webpack.commonjs.cjs';
import {sharedDependenciesLazy} from '../deps.cjs';

const distPath = 'wwwroot/dist';
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
        entry:
        {
            'main': './app/bootstrap'
        },
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
        ...hmr ?
            {
                devServer:
                {
                    hot: true,
                    port: 9000,
                    static:
                    {
                        directory: path.join(dirName, distPath, 'assets'),
                        publicPath: '/dist/assets',
                        watch: true
                    },
                    devMiddleware:
                    {
                        publicPath: '/dist/',
                        writeToDisk: true,
                    },
                    client:
                    {
                        logging: 'info',
                        overlay:
                        {
                            errors: true,
                            warnings: false
                        },
                        progress: true,
                    },
                },
                devtool: 'eval-source-map'
            } :
            {
                devtool: 'source-map'
            },
        target: ssr ? 'node' : 'web',
        //TODO remove this when https://github.com/webpack/webpack-dev-server/issues/2792 is fixed
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
        resolve:
        {
            symlinks: false,
            extensions: ['.ts', '.mjs', '.js'],
            mainFields: ['esm2022', 'es2022', 'esm2020', 'esm2015', 'es2015', 'jsnext:main', 'browser', 'module', 'main'],
            conditionNames: ['esm2022', 'es2022', 'esm2020', 'es2015', 'import']
        },
        module:
        {
            rules:
            [
                ...hmr ? 
                [
                    {
                        loader: HmrLoader,
                        include: path.join(dirName, 'app', angularEntryFile),
                    }
                ] : [],
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
                name: 'main',
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
                isNgsw: ngsw,
                jsDevMode: !prod,
                ...prod ? {ngDevMode: false} : {},
                ngI18nClosureMode: false
            }),
            new HtmlWebpackPlugin(
            {
                filename: '../index.html',
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
