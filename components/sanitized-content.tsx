import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkBreaks from 'remark-breaks'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import type { Node, Parent } from 'unist'
import type { Element } from 'hast'

import { APP_DOMAIN } from '@/lib/constants'

const internalDomain =
  process.env.NODE_ENV === 'production' ? APP_DOMAIN : 'localhost'

function rehypeLinks() {
  return (tree: Node) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'a') {
        node.properties = node.properties || {}

        const href = node.properties.href as string

        if (href) {
          if (!href.includes(internalDomain) && !href.startsWith('/')) {
            node.properties.target = '_blank'
            node.properties.rel = 'noopener noreferrer'
          }
        }

        if (!node.properties.className) {
          node.properties.className = []
        }
        if (Array.isArray(node.properties.className)) {
          node.properties.className.push('custom-link')
        } else {
          node.properties.className += ' custom-link'
        }
      }
    })
  }
}

function rehypeInlineCode() {
  return (tree: Node) => {
    visit(
      tree,
      'element',
      (node: Element, index: number, parent: Parent | undefined) => {
        if (node.tagName === 'code' && node.properties) {
          if (parent && (parent as Element).tagName !== 'pre') {
            if (!node.properties.className) {
              node.properties.className = []
            }
            if (Array.isArray(node.properties.className)) {
              node.properties.className.push('inline-code')
            } else {
              node.properties.className += ' inline-code'
            }
          } else {
            if (!node.properties.className) {
              node.properties.className = []
            }
            if (Array.isArray(node.properties.className)) {
              node.properties.className.push('code-block')
            } else {
              node.properties.className += ' code-block'
            }
          }
        }
      },
    )
  }
}

const processor = unified()
  .use(remarkParse) // Convert into markdown AST
  .use(remarkBreaks) // Add line breaks
  .use(remarkRehype) // Transform to HTML AST
  .use(rehypeSanitize) // Sanitize HTML input
  .use(rehypeLinks) // Add links
  .use(rehypeInlineCode) // Add inline code
  .use(rehypeHighlight) // Highlight code blocks
  .use(rehypeStringify) // Convert AST into serialized HTML

export default async function SanitizedContent({
  content,
}: {
  content: string
}) {
  const file = await processor.process(content)
  const sanitizedHtml = String(file)

  return (
    <div
      className="md space-y-4"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  )
}
