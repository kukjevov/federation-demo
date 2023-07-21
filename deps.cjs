const dependencies = require('./package.json');

const sharedDependencies = {};
const sharedDependenciesLazy = {};

for(const dep in dependencies.dependencies)
{
    const version = dependencies.dependencies[dep];

    sharedDependencies[dep] =
    {
        eager: true,
        singleton: true,
        requiredVersion: version,
        version: version,
    };

    sharedDependenciesLazy[dep] =
    {
        singleton: true,
        requiredVersion: version,
        version: version,
    };
}

exports.sharedDependencies = sharedDependencies;
exports.sharedDependenciesLazy = sharedDependenciesLazy;