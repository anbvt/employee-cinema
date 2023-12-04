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
          <Menu />
          {children}
        </body>
      </SessionProvider>
    </html>
  )
}
