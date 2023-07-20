import {Component} from '@angular/core';

export const test = 20;
export function run()
{
    console.log('from lib');

    return true;
}

console.log('isBlank lib', Component);