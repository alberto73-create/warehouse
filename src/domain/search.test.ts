import {describe,expect,it} from 'vitest';
import {demoParts} from '../data/demo';
import {findPartByCode} from './search';
describe('ricerca da QR',()=>{
 it('trova il codice valido anche con spazi',()=>expect(findPartByCode(demoParts,' 93000114900 ')?.code).toBe('93000114900'));
 it('restituisce undefined per un QR sconosciuto',()=>expect(findPartByCode(demoParts,'NON-ESISTE')).toBeUndefined());
});
