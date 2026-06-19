import { Geist_Mono, Inter, Roboto } from 'next/font/google'

import { AppHeader } from '@/components/layouts/AppHeader'
import { ThemeProvider } from '@/components/themes/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import './globals.css'

const robotoHeading = Roboto({ subsets: ['latin'], variable: '--font-heading' })

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn(
        'antialiased',
        fontMono.variable,
        'font-sans',
        inter.variable,
        robotoHeading.variable,
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <AppHeader />
            <main className='flex-1'>{children}</main>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
