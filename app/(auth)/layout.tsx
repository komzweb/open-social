import Header from '@/components/header'
import Footer from '@/components/footer'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header authNav={false} />
      <main className="flex grow flex-col justify-center py-4">
        <div className="mx-auto max-w-md px-4">{children}</div>
      </main>
      <Footer />
    </div>
  )
}
