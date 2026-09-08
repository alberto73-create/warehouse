import {WarehouseApp} from '@/components/WarehouseApp';
export default async function PartPage({params}:{params:Promise<{code:string}>}){const {code}=await params;return <WarehouseApp initialCode={decodeURIComponent(code)}/>}
