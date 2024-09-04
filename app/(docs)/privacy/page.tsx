import type { Metadata } from 'next'
import { ORG_NAME, APP_NAME, SITE_URL } from '@/lib/constants'

const LAST_UPDATED = '2024-07-27'

const metaTitle = 'Privacy Policy'
const metaDescription =
  'This page outlines the privacy policy for our service, detailing how we handle user privacy and data protection. Learn about how we collect, use, and protect user information.'

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    url: `${SITE_URL}/privacy`,
  },
}

export default function PrivacyPage() {
  return (
    <article>
      <header>
        <h1>Privacy Policy</h1>
      </header>
      <section>
        <h2>1. Introduction</h2>
        <p>
          This privacy policy outlines how we handle user privacy and data
          protection for {APP_NAME} (hereinafter referred to as &quot;this
          service&quot;). {ORG_NAME} (hereinafter referred to as
          &quot;operator&quot;) respects user privacy and handles personal
          information in accordance with applicable laws and regulations.
        </p>
      </section>
      <section>
        <h2>2. Information Collected</h2>
        <p>The operator may collect the following information:</p>
        <div>
          <p>2.1. Information provided by the user:</p>
          <ul>
            <li>
              Information when registering an account (user name, email address)
            </li>
            <li>
              Profile information (additional information provided voluntarily)
            </li>
            <li>
              Post content, comments, and other content shared by users on this
              service
            </li>
          </ul>
        </div>
        <div>
          <p>2.2. Information automatically collected:</p>
          <ul>
            <li>IP address</li>
            <li>Device information (OS, browser type, etc.)</li>
            <li>Usage log (access date and time, used functions, etc.)</li>
            <li>Cookie information</li>
          </ul>
        </div>
      </section>
      <section>
        <h2>3. Information use purpose</h2>
        <p>The collected information is used for the following purposes:</p>
        <ul>
          <li>Providing and operating this service</li>
          <li>Managing user accounts</li>
          <li>Providing customer support</li>
          <li>Service improvement and new feature development</li>
          <li>Usage analysis and statistics</li>
          <li>Preventing and securing against unauthorized use</li>
          <li>Checking compliance with laws and regulations</li>
        </ul>
      </section>
      <section>
        <h2>4. Information sharing</h2>
        <p>
          The operator does not share user&apos;s personal information with
          third parties except in the following cases:
        </p>
        <ul>
          <li>When the user&apos;s consent is obtained</li>
          <li>When required by law</li>
          <li>
            When sharing with service providers necessary for the operation of
            this service (e.g. hosting providers)
          </li>
          <li>
            When disclosing to the successor of the business such as merger,
            acquisition, or asset sale
          </li>
        </ul>
      </section>
      <section>
        <h2>5. Data protection</h2>
        <p>
          The operator takes appropriate technical and organizational measures
          to protect user&apos;s personal information. However, we cannot
          guarantee the complete security on the internet.
        </p>
      </section>
      <section>
        <h2>6. User rights</h2>
        <p>
          Users have the following rights regarding their personal information:
        </p>
        <ul>
          <li>Access right (request to disclose personal information)</li>
          <li>Correction right (request to correct incorrect information)</li>
          <li>Deletion right (request to delete personal information)</li>
          <li>
            Request to limit processing (request to limit the processing of
            personal information)
          </li>
          <li>
            Data portability right (request to transfer personal information to
            another service)
          </li>
        </ul>
        <p>
          If you wish to exercise these rights, please contact{' '}
          <a href={`mailto:${process.env.EMAIL_SUPPORT}`}>
            {process.env.EMAIL_SUPPORT}
          </a>
          .
        </p>
      </section>
      <section>
        <h2>7. Use of Cookies</h2>
        <p>
          This service uses cookies for the improvement of user experience and
          analysis of usage. You can disable cookies in your browser settings,
          but some features may not work.
        </p>
      </section>
      <section>
        <h2>8. Privacy for Minors</h2>
        <p>
          This service is not intended for minors under 18 years of age. We do
          not intentionally collect personal information from minors under 18
          years of age.
        </p>
      </section>
      <section>
        <h2>9. Changes to Privacy Policy</h2>
        <p>
          The operator may change this policy as necessary. If there are
          significant changes, we will notify you on this service.
        </p>
      </section>
      <section>
        <h2>10. Contact</h2>
        <p>
          For questions or inquiries regarding this privacy policy, please
          contact{' '}
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
