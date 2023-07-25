import {Component, ChangeDetectionStrategy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BindThis} from '@jscrpt/common';
import {config} from 'app-config';

console.log('confiiiiiig', config);

export const test = 20;
export function run()
{
    console.log('from lib');

    return true;
}

console.log('isBlank lib', Component, BindThis);

export const bindThis = BindThis;

/**
 * Test componet from lib
 */
@Component(
{
    selector: 'selector',
    template: `
    <div *ngIf="visible">test component</div>
    <button (click)="visible = !visible">click</button>
    `,
    standalone: true,
    imports:
    [
        CommonModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestSAComponent
{
    //######################### protected properties - template bindings #########################

    protected visible: boolean = true;
}