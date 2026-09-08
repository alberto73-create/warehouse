import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'Magazzino tecnico', description:'Ricambi, subito a portata di mano', manifest:'/manifest.webmanifest', appleWebApp:{capable:true,title:'Magazzino'} };
export const viewport: Viewport = { themeColor:'#17243d', width:'device-width', initialScale:1 };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="it"><body>{children}</body></html> }
