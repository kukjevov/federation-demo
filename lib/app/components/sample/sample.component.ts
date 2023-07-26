import {Component, ChangeDetectionStrategy} from '@angular/core';
import {RouterModule} from '@angular/router';

/**
 * Component that servers as menu sample component
 */
@Component(
{
    selector: 'menu-sample',
    templateUrl: 'sample.component.html',
    styleUrls: ['sample.component.scss'],
    standalone: true,
    imports:
    [
        RouterModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleSAComponent
{
}