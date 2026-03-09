import type { Metadata } from "next"
import { Inter, DM_Sans, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { RoleProvider } from "@/context/RoleContext"
import { Providers } from "@/app/providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })

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
      <body className={`${inter.variable} ${dmSans.variable} ${spaceGrotesk.variable} font-sans antialiased selection:bg-[#07da63]/30 bg-black text-white`}>
        <Providers>
          <RoleProvider>
            {children}
          </RoleProvider>
        </Providers>
      </body>
    </html>
  )
}
