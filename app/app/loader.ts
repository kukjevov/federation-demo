export function loadScript()
{
    const element = document.createElement('script');

    element.src = 'http://localhost:8080/remoteEntry.js';
    element.type = 'text/javascript';
    element.async = true;

    element.onload = () =>
    {
        resolve();
    };

    document.head.appendChild(element);

    let resolve: any;
    const promise = new Promise(res => resolve = res);

    return promise;
}

export function loadComponent(scope: any, module: any) 
{
    return async () => 
    {
        // Initializes the share scope. This fills it with known provided modules from this build and all remotes
        await __webpack_init_sharing__('default');
        const container = window[scope] as any; // or get the container somewhere else
        // Initialize the container, it may provide shared modules
        await container.init(__webpack_share_scopes__['default']);
        const factory = await container.get(module);
        const Module = factory();
        
        return Module;
    };
}