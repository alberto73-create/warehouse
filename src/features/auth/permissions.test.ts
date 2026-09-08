import {describe,expect,it} from 'vitest';import {can} from './permissions';
const base={id:'current' as const,operator:'12',role:'base' as const},manager={...base,role:'manager' as const};
describe('permessi',()=>{it('nega rettifiche ed export al Base',()=>{expect(can(base,'adjust')).toBe(false);expect(can(base,'export')).toBe(false)});it('consente le funzioni avanzate al Manager',()=>expect(can(manager,'manage-bins')).toBe(true))});
