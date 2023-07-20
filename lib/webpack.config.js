import webpack from 'webpack';
import path from 'path';
import sharedDependencies from '../deps.cjs';
import {dirName} from './webpack.commonjs.cjs';

export default
{
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
        new webpack.container.ModuleFederationPlugin(
        {
            name: 'lib',
            filename: 'remoteEntry.js',
            // library: { type: 'var', name: 'lib' },
            exposes:
            {
                './lib': './src/lib',
            },
            // shareScope: 'default',
            shared:
            {
                ...sharedDependencies,
            },
        }),
    ],
};
