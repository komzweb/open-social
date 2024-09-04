import type { Metadata } from 'next'

import SanitizedContent from '@/components/sanitized-content'
import { APP_NAME, SITE_URL } from '@/lib/constants'

const metaTitle = 'Markdown Syntax'
const metaDescription = `This page shows examples of using Markdown. In ${APP_NAME}, you can use Markdown to create posts and comments.`

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    url: `${SITE_URL}/markdown`,
  },
}

export default function MarkdownPage() {
  return (
    <article>
      <header>
        <h1>Markdown Syntax</h1>
        <p>In {APP_NAME}, you can use Markdown to create posts and comments.</p>
      </header>
      <section>
        <h2>Examples of Markdown Syntax</h2>
        <p>
          Markdown syntax allows you to easily format text. Below are some
          examples of basic syntax.
        </p>

        <h3>1. Headings</h3>
        <div className="mt-2 flex flex-col bg-slate-800 p-4 text-sm text-white">
          <span>## Heading 1</span>
          <span>### Heading 2</span>
        </div>
        <div className="mt-1 border border-slate-600 p-4 pt-0">
          <SanitizedContent content={'## Heading 1\n' + '### Heading 2'} />
        </div>

        <h3>2. Emphasis</h3>
        <div className="mt-2 flex flex-col bg-slate-800 p-4 text-sm text-white">
          <span>**Bold**</span>
          <span>*Italic*</span>
        </div>
        <div className="mt-1 border border-slate-600 p-4 pt-1.5 text-sm">
          <SanitizedContent content={'**Bold**\n' + '*Italic*'} />
        </div>

        <h3>3. List</h3>
        <div className="mt-2 space-y-4 bg-slate-800 p-4 text-sm text-white">
          <div className="flex flex-col">
            <span>- List item 1</span>
            <span>- List item 2</span>
            <span>- List item 3</span>
          </div>
          <div className="flex flex-col">
            <span>1. List item 1</span>
            <span>1. List item 2</span>
            <span>1. List item 3</span>
          </div>
        </div>
        <div className="mt-1 border border-slate-600 p-4 pl-2.5 pt-1.5 text-sm">
          <SanitizedContent
            content={
              '- List item 1\n' +
              '- List item 2\n' +
              '- List item 3\n' +
              '\n' +
              '1. List item 1\n' +
              '2. List item 2\n' +
              '3. List item 3'
            }
          />
        </div>

        <h3>4. Link</h3>
        <div className="mt-2 bg-slate-800 p-4 text-sm text-white">
          <span>[Link Text](https://example.com)</span>
        </div>
        <div className="mt-1 border border-slate-600 p-4 pt-1.5 text-sm">
          <SanitizedContent content={'[Link Text](https://example.com)'} />
        </div>

        <h3>5. Quote</h3>
        <div className="mt-2 bg-slate-800 p-4 text-sm text-white">
          <span>&gt; Quote Text</span>
        </div>
        <div className="mt-1 border border-slate-600 p-4 pt-1.5 text-sm">
          <SanitizedContent content={'> Quote Text'} />
        </div>

        <h3>6. Horizontal Line</h3>
        <div className="mt-2 bg-slate-800 p-4 text-sm text-white">
          <span>---</span>
        </div>
        <div className="mt-1 border border-slate-600 p-4 text-sm">
          <SanitizedContent content={'---'} />
        </div>

        <h3>7. Inline Code</h3>
        <div className="mt-2 bg-slate-800 p-4 text-sm text-white">
          <span>`inline code`</span>
        </div>
        <div className="mt-1 border border-slate-600 p-4 pt-1.5 text-sm">
          <SanitizedContent content={'`inline code`'} />
        </div>

        <h3>8. Code Block</h3>
        <div className="mt-2 flex flex-col bg-slate-800 p-4 text-sm text-white">
          <span>```js</span>
          <span>{'function add(a, b) {'}</span>
          <span className="whitespace-pre">{'    return a + b;'}</span>
          <span>{'}'}</span>
          <span>{'console.log("Total: " + add(10, 5)); // Total: 15'}</span>
          <span>```</span>
        </div>
        <div className="mt-1 border border-slate-600 p-1 text-sm">
          <SanitizedContent
            content={
              '```js\nfunction add(a, b) {\n  return a + b;\n}\nconsole.log("Total: " + add(10, 5)); // Total: 15\n```'
            }
          />
        </div>
      </section>
    </article>
  )
}
