"use client"
import { Menu } from '@components'
import './../globals.css'
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <SessionProvider>
        <body>
          <div className='grid grid-cols-5 gap-5'>
          <Menu />
          <div className='col-span-4'>
          {children}
          </div>
          </div>
        </body>
      </SessionProvider>
    </html>
  )
}
