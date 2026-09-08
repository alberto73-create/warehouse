import type {Part} from './types';
export function findPartByCode(parts:Part[],rawValue:string){const code=rawValue.trim().toLocaleLowerCase('it');return parts.find(part=>part.code.toLocaleLowerCase('it')===code)}
