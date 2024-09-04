import Header from '@/components/header'
import Footer from '@/components/footer'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="grow py-4">
        <div className="container mx-auto px-4">{children}</div>
      </main>
      <Footer />
    </div>
  )
}
