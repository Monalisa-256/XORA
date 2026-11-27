import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'XORA — A private way to connect',description:'XORA private adult dating web application. Controlled onboarding; matching and payments closed.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip" href="#content">Skip to content</a>{children}</body></html>;}
