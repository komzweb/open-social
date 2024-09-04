import type { Metadata } from 'next'
import { APP_NAME, SITE_URL } from '@/lib/constants'

const metaTitle = `About ${APP_NAME}`
const metaDescription = `Learn more about ${APP_NAME}.`

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    url: `${SITE_URL}/about`,
  },
}

export default function AboutPage() {
  return (
    <article>
      <header>
        <h1>About {APP_NAME}</h1>
        <p>
          {APP_NAME} is an application that provides an open discussion platform
          focused on the latest technology. It was developed inspired by Reddit
          and Hacker News, and has features that are not found in existing
          platforms like X/Twitter and Discord.
        </p>
      </header>
      <section>
        <h2>Why {APP_NAME}?</h2>
        <h3>Importance of Open Discussion</h3>
        <p>
          The advancement of technology is accelerated by diverse perspectives
          and constructive criticism. {APP_NAME} aims to promote innovation and
          develop better technology by providing a platform where anyone can
          express their opinions and exchange ideas freely.
        </p>
        <h3>Platform Openness</h3>
        <p>
          To surpass the limitations of closed systems and one-way communication
          in existing SNS, {APP_NAME} adopts a completely open design. Unlike
          closed communities like Discord, anyone can freely participate in
          discussions and contribute to them.
        </p>
        <h3>The intentional exclusion of the follow function</h3>
        <p>
          To avoid being influenced by the influence of specific influencers or
          opinion leaders, {APP_NAME} does not have a follow function. This
          promotes fair evaluation based on the essence of ideas and the
          exchange of diverse opinions.
        </p>
        <h3>Visualization of Contribution</h3>
        <p>
          The user&apos;s contribution is quantified as &quot;karma&quot;. The
          more the user&apos;s posts and comments are highly evaluated by other
          users, the higher the user&apos;s karma will rise. Karma reflects the
          quality and quantity of the user&apos;s contribution, serving as a
          measure of trust within the community.
        </p>
      </section>
      <section>
        <h2>Features of {APP_NAME}</h2>
        <ul>
          <li>
            <span className="font-semibold">Technology-focused:</span> Provides
            a discussion platform focused on the latest technology trends,
            innovations, and future possibilities.
          </li>
          <li>
            <span className="font-semibold">Open Access:</span> Anyone can
            freely participate, share knowledge, and learn.
          </li>
          <li>
            <span className="font-semibold">Fairness:</span> Discussions are not
            influenced by follower numbers or popularity, but by the quality and
            usefulness of the ideas.
          </li>
          <li>
            <span className="font-semibold">
              Contribution Evaluation by Karma:
            </span>{' '}
            Visualizes user contributions as karma, encouraging high-quality
            participation.
          </li>
        </ul>
      </section>
      <section>
        <h2>Let&apos;s create the future together</h2>
        <p>
          {APP_NAME} is a platform for thinking and shaping the future of
          technology together. Your unique perspective and knowledge may be the
          next big breakthrough. Let&apos;s participate in the latest
          discussions and create the future of technology together.
        </p>
      </section>
    </article>
  )
}
