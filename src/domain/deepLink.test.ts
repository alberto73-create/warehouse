import {describe,expect,it} from 'vitest';import {partPath} from './deepLink';
describe('deep link',()=>it('codifica il codice nella route ricambio',()=>expect(partPath('ABC 12')).toBe('/ricambi/ABC%2012')));
