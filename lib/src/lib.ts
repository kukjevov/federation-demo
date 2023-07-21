import {Component, ChangeDetectionStrategy} from '@angular/core';
import {BindThis} from '@jscrpt/common';

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
    <div>test component</div>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestSAComponent
{
}