import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
 title: 'Scholar Search',
 description: 'Academic paper search application',
}

export default function RootLayout({
 children,
}: {
 children: React.ReactNode
}) {
 return (
   <html lang="en">
     <body className="min-h-screen bg-background font-sans antialiased">
       {children}
     </body>
   </html>
 )
}