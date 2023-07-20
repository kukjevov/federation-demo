import {Component} from '@angular/core';

console.log('toto je appka');

declare const __webpack_init_sharing__: any;
declare const __webpack_share_scopes__: any;

function loadScript()
{
    const element = document.createElement('script');

    element.src = 'http://localhost:8080/remoteEntry.js';
    element.type = 'text/javascript';
    element.async = true;

    console.log('loading');

    element.onload = () =>
    {
        console.log('loaded');
        resolve();
    };

    document.head.appendChild(element);

    let resolve;
    const promise = new Promise(res => resolve = res);

    return promise;
}

function loadComponent(scope, module) 
{
    return async () => 
    {
        // Initializes the share scope. This fills it with known provided modules from this build and all remotes
        await __webpack_init_sharing__('default');
        const container = window[scope] as any; // or get the container somewhere else
        // Initialize the container, it may provide shared modules
        console.log('xxxxx', __webpack_share_scopes__, container);
        await container.init(__webpack_share_scopes__.default);
        const factory = await container.get(module);
        const Module = factory();
        
        return Module;
    };
  }

async function run()
{
    console.log('running');

    await loadScript();

    console.log(window);

    const module = await loadComponent('lib', './lib')();
    console.log('moduleeee', module);
    console.log(module.test);
    console.log(module.run());
}

run();

console.log('isBlank app', Component);