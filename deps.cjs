const dependencies = require('./package.json');

const sharedDependencies = {};

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
}

module.exports = sharedDependencies;