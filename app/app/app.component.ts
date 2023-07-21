import {Component, ChangeDetectionStrategy, OnInit, Type, ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';

import {loadComponent, loadScript} from './loader';

/**
 * Main entry application component
 */
@Component(
{
    selector: 'app',
    templateUrl: 'app.component.html',
    standalone: true,
    imports:
    [
        CommonModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppSAComponent implements OnInit
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