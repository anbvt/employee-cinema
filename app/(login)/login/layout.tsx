"use client"

import { SessionProvider } from 'next-auth/react'
import './../../globals.css'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Zuhot cho Nhân viên</title>
      </head>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
