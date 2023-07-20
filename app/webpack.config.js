const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const path = require('path');

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
        extensions: [".ts", ".js"],
        extensionAlias: 
        {
            ".js": [".js", ".ts"],
            ".cjs": [".cjs", ".cts"],
            ".mjs": [".mjs", ".mts"]
        }
    },
    module: 
    {
        rules: 
        [
            {
                test: /\.([cm]?ts|tsx)$/,
                loader: "ts-loader"
            }
        ]
    },
    plugins:
    [
        new ModuleFederationPlugin(
        {
            name: 'main',
            shared:
            {
                "@angular/core":
                {
                    eager: true,
                    version: "16.1.4",
                }
            },
        }),
        new HtmlWebpackPlugin(),
    ],
};
