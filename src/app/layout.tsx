import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Konvert — Hub Operacional para Deliverys',
  description: 'Transforme seu delivery em receita previsível. Unifique pedidos, recupere carrinhos e gerencie sua operação com o Konvert.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-[#0A0F1E] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
