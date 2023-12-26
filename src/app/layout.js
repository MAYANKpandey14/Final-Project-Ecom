import GlobalState from '@/context'
import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/FooterSection'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Oasis',
  description: 'Ecommerce Store',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='scroll-smooth'>
      <body className={inter.className}>
        <GlobalState>
          <Navbar/>
          <main className='flex min-h-screen flex-col mt-[80px]'>{children}</main>
          <Footer/>
        </GlobalState>
      </body>
    </html>
  )
}
