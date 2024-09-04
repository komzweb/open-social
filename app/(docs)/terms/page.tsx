import type { Metadata } from 'next'
import { ORG_NAME, APP_NAME, SITE_URL } from '@/lib/constants'

const LAST_UPDATED = '2024-07-27'

const metaTitle = 'Terms of Service'
const metaDescription = `Detailed explanation of the terms of use for ${APP_NAME}. Please check the rules and responsibilities that users must follow.`

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    url: `${SITE_URL}/terms`,
  },
}

export default function TermsPage() {
  return (
    <article>
      <header>
        <h1>Terms of Service</h1>
      </header>
      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to {APP_NAME} (hereinafter referred to as &quot;this
          service&quot;). This service is operated by {ORG_NAME} (hereinafter
          referred to as &quot;operator&quot;). This Terms of Service
          (hereinafter referred to as &quot;this agreement&quot;) specifies the
          conditions for using this service.
        </p>
      </section>
      <section>
        <h2>2. Consent to Terms of Service</h2>
        <p>
          By using this service, you are deemed to have agreed to this
          agreement. If you do not agree to this agreement, please refrain from
          using this service.
        </p>
      </section>
      <section>
        <h2>3. Service Description</h2>
        <p>
          {APP_NAME} is a platform that provides an open discussion space
          focused on technology. Users can post, comment, and discuss topics
          related to technology.
        </p>
      </section>
      <section>
        <h2>4. Account Registration</h2>
        <div>
          <div className="flex space-x-1">
            <span>4.1.</span>
            <span>
              To use some features of this service, you need to register an
              account.
            </span>
          </div>
          <div className="flex space-x-1">
            <span>4.2.</span>
            <span>
              Users are responsible for providing accurate and up-to-date
              information.
            </span>
          </div>
        </div>
      </section>
      <section>
        <h2>5. Use Rules</h2>
        <p>Users agree not to engage in the following behaviors:</p>
        <div className="mt-2">
          <div className="flex space-x-1">
            <span>5.1.</span>
            <span>
              Posting content that is illegal, harmful, threatening, abusive,
              harassing, defamatory, offensive, obscene, or violates
              others&apos; privacy
            </span>
          </div>
          <div className="flex space-x-1">
            <span>5.2.</span>
            <span>Distributing spam, phishing, malware</span>
          </div>
          <div className="flex space-x-1">
            <span>5.3.</span>
            <span>Impersonating someone else</span>
          </div>
          <div className="flex space-x-1">
            <span>5.4.</span>
            <span>
              Posting content that infringes on copyrights, trademarks, or other
              intellectual property rights
            </span>
          </div>
          <div className="flex space-x-1">
            <span>5.5.</span>
            <span>
              Actions that place undue load on the system or network of this
              service
            </span>
          </div>
        </div>
      </section>
      <section>
        <h2>6. Content Ownership</h2>
        <div>
          <div className="flex space-x-1">
            <span>6.1.</span>
            <span>Users own the copyrights to the content they post.</span>
          </div>
          <div className="flex space-x-1">
            <span>6.2.</span>
            <span>
              Users grant the operator a non-exclusive, worldwide, royalty-free
              license to use, reproduce, modify, and distribute the content they
              post on this service.
            </span>
          </div>
        </div>
      </section>
      <section>
        <h2>7. Privacy</h2>
        <p>
          The operator&apos;s privacy policy explains the policy for collecting,
          using, and disclosing personal information. By using this service,
          users are deemed to have agreed to the privacy policy.
        </p>
      </section>
      <section>
        <h2>8. Changes and Termination of Service</h2>
        <div>
          <div className="flex space-x-1">
            <span>8.1.</span>
            <span>
              The operator has the right to change, stop, or terminate the
              entire or part of this service without prior notice.
            </span>
          </div>
          <div className="flex space-x-1">
            <span>8.2.</span>
            <span>
              The operator has the right to stop or delete the account without
              prior notice if the user violates this agreement.
            </span>
          </div>
        </div>
      </section>
      <section>
        <h2>9. Disclaimer</h2>
        <div>
          <div className="flex space-x-1">
            <span>9.1.</span>
            <span>
              This service is provided &quot;as is&quot; and the operator makes
              no warranties, either express or implied.
            </span>
          </div>
          <div className="flex space-x-1">
            <span>9.2.</span>
            <span>
              The operator is not liable for any direct, indirect, incidental,
              special, consequential, or other damages resulting from the use of
              this service.
            </span>
          </div>
        </div>
      </section>
      <section>
        <h2>10. Applicable Law and Jurisdiction</h2>
        <p>
          This agreement is governed by and construed in accordance with the
          laws of Japan, and any disputes arising out of this agreement are
          subject to exclusive jurisdiction of the Tokyo District Court.
        </p>
      </section>
      <section>
        <h2>11. Changes</h2>
        <p>
          The operator has the right to modify this agreement as necessary. If
          there are significant changes, we will notify you on this service. By
          continuing to use this service after the changes, you agree to the
          modified terms.
        </p>
      </section>
      <section>
        <h2>12. Contact</h2>
        <p>
          For questions or inquiries regarding this agreement, please contact{' '}
          <a href={`mailto:${process.env.EMAIL_SUPPORT}`}>
            {process.env.EMAIL_SUPPORT}
          </a>
          .
        </p>
      </section>
      <div className="mt-8 text-sm">
        <p>Last updated: {LAST_UPDATED}</p>
      </div>
    </article>
  )
}
