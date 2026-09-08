import {describe,expect,it} from 'vitest';
import type {Bin,Part} from '@/domain/types';
import {mergeBins,mergeParts} from './catalog';
describe('concorrenza configurazioni LWW',()=>{it('sceglie updatedAt più recente per una soglia',()=>{const base:Part={code:'A',name:'A',description:'',minimum:1,favorite:false,stock:{},updatedAt:'2026-01-01T10:00:00Z',updatedBy:'A'};expect(mergeParts([base],[{...base,minimum:4,updatedAt:'2026-01-01T11:00:00Z',updatedBy:'B'}])[0].minimum).toBe(4)});it('usa device id come spareggio deterministico',()=>{const bin:Bin={id:'buoni-1',label:'Uno',row:1,column:1,rowSpan:1,columnSpan:1,enabled:true,updatedAt:'2026-01-01T10:00:00Z',updatedBy:'A'};expect(mergeBins([bin],[{...bin,label:'Nuovo',updatedBy:'B'}])[0].label).toBe('Nuovo')})});
