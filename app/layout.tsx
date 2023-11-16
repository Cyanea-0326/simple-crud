import { GeistSans } from 'geist/font'
import './globals.css'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Simple web-application Next.js and Supabase',
  description: 'Understanding the basics of web apps and implementing CRUD',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="">
        <main className="">
          {children}
        </main>
      </body>
    </html>
  )
}
