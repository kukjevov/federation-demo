const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const path = require('path');

module.exports =
{
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
                "@angular/core":
                {
                    eager: true,
                    version: "16.1.4",
                }
            },
        }),
    ],
};
