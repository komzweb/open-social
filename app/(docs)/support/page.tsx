import type { Metadata } from 'next'
import { APP_NAME, SITE_URL } from '@/lib/constants'

const metaTitle = 'Support'
const metaDescription = `Support page for ${APP_NAME}. You can check the contact information for inquiries.`

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    url: `${SITE_URL}/support`,
  },
}

export default function SupportPage() {
  return (
    <article>
      <h1 className="text-teal-500">{APP_NAME} Support</h1>
      <p className="text-slate-500">
        For questions or inquiries regarding {APP_NAME}, please contact{' '}
        <a href={`mailto:${process.env.EMAIL_SUPPORT}`}>
          {process.env.EMAIL_SUPPORT}
        </a>
        .
      </p>
    </article>
  )
}
