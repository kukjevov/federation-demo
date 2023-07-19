const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const path = require('path');

module.exports =
{
    entry:
    {
        'main': './src/app.js'
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
    plugins:
    [
        new ModuleFederationPlugin(
        {
            name: 'main',
            shared:
            {
                testxxx:
                {
                    eager: true,
                    singleton: true,
                }
            },
        }),
        new HtmlWebpackPlugin(),
    ],
};
