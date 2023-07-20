import {Component} from '@angular/core';
import {BindThis} from '@jscrpt/common';

export const test = 20;
export function run()
{
    console.log('from lib');

    return true;
}

console.log('isBlank lib', Component, BindThis);

export const bindThis = BindThis;