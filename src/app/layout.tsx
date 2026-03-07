import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import { RoleProvider } from "@/context/RoleContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Foundry Network | The Marketplace for Internet Builders",
  description: "Foundry brings founders, freelancers, and job seekers together so you can stop juggling platforms and start building faster.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased selection:bg-primary/30`}>
        <RoleProvider>
          <Navbar />
          {children}
        </RoleProvider>
      </body>
    </html>
  )
}


