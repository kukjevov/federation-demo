import {Component, ChangeDetectionStrategy, Type, ChangeDetectorRef} from '@angular/core';
import {ComponentRoute, ComponentRedirectRoute} from '@anglr/common/router';
import {Authorize, AuthGuard} from '@anglr/authentication';

import {loadComponent, loadScript} from '../../../loader';

/**
 * Home component
 */
@Component(
{
    selector: 'home-view',
    templateUrl: 'home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRoute({path: 'home', canActivate: [AuthGuard]})
@Authorize('home-page')
export class HomeComponent
{
    //######################### protected properties - template bindings #########################

    protected component: Type<unknown>|undefined|null;

    //######################### constructor #########################
    constructor(private _changeDetector: ChangeDetectorRef,)
    {
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public async ngOnInit(): Promise<void>
    {
        console.log('init running');
        
        await loadScript();
        const {TestSAComponent} = await loadComponent('lib', './lib')();

        this.component = TestSAComponent;

        this._changeDetector.detectChanges();
    }
}
