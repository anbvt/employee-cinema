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
        <body >
          <Menu />
          <div style={{ width: "85%", float: "right" }}>
            {children}
          </div>
        </body>
      </SessionProvider>
    </html>
  )
}
