import { Bebas_Neue, DM_Sans, DM_Mono } from 'next/font/google'

const bebas = Bebas_Neue({ subsets: ['latin'], weight: ['400'], variable: '--font-display', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300','400','500','600'], variable: '--font-body', display: 'swap' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['300','400','500'], variable: '--font-mono', display: 'swap' })

export const metadata = {
  title: 'SENTINEL — Damage Detection Tool',
  description: 'AI-powered satellite damage detection.',
}

export default function ToolLayout({ children }) {
  return (
    <div className={`${bebas.variable} ${dmSans.variable} ${dmMono.variable}`}>
      {children}
    </div>
  )
}
