import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { BrcContextProvider } from '@/context/context'
const inter = Inter({ subsets: ['latin'] })
const grotext = Space_Grotesk({ subsets: ['latin'], weight: ['500'] })

export const metadata = {
  title: 'BRC-500',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <BrcContextProvider>
        <body className={grotext.className}>{children}</body>
      </BrcContextProvider>
    </html>
  )
}
