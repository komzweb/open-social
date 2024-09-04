import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import { Toaster } from 'sonner'

import ActionSuccessToast from '@/components/action-success-toast'
import { ThemeProvider } from '@/components/theme-provider'
import { APP_NAME, SITE_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: `${APP_NAME} is a social site for open discussion and collaboration focused on cutting-edge technology.`,
  openGraph: {
    siteName: APP_NAME,
    title: APP_NAME,
    description: `${APP_NAME} is a social site for open discussion and collaboration focused on cutting-edge technology.`,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn('text-slate-950 dark:text-slate-100', inter.className)}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            toastOptions={{
              classNames: {
                toast:
                  'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700',
                title: 'text-slate-950 dark:text-slate-100',
                closeButton:
                  'text-slate-950 hover:bg-slate-200 dark:text-slate-100 dark:hover:bg-slate-700',
                error: 'text-red-500',
                success: 'text-teal-500',
              },
            }}
            closeButton
          />
          <Suspense fallback={null}>
            <ActionSuccessToast />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
