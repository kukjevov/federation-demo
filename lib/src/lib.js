import {showText, textVar, SomeClass} from 'testxxx';

export const test = 20;
export function run()
{
    console.log('from lib');

    console.log('from lib testxxx', showText(), textVar);
}

export const classInstance = new SomeClass();