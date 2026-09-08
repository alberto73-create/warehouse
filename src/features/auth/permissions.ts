import type {Session} from '@/domain/types';
export type Permission='read'|'move'|'request'|'history'|'manage-parts'|'manage-bins'|'adjust'|'export';
const managerOnly=new Set<Permission>(['manage-parts','manage-bins','adjust','export']);
export const can=(session:Session,permission:Permission)=>session.role==='manager'||!managerOnly.has(permission);
