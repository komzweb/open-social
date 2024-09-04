import Header from '@/components/header'
import Footer from '@/components/footer'
import styles from '@/styles/docs.module.css'

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header authNav={false} />
      <main className="grow py-8">
        <div className="mx-auto max-w-prose px-4">
          <div className={styles.docs}>{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
