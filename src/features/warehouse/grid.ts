import type {Bin} from '@/domain/types';
export const orderedBins=(bins:Bin[])=>[...bins].sort((a,b)=>a.row-b.row||a.column-b.column);
