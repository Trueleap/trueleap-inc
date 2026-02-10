/**
 * Migrate MDX globals (privacy-page, terms-page) to Payload CMS.
 * Converts markdown to Payload Lexical richText format.
 *
 * Usage: npx tsx scripts/migrate-mdx-globals.ts
 */

import fs from 'fs'
import path from 'path'
import YAML from 'yaml'

const PAYLOAD_URL = process.env.PAYLOAD_URL ?? 'http://localhost:3000'
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY ?? ''
const PAYLOAD_TOKEN = process.env.PAYLOAD_TOKEN ?? ''

const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(PAYLOAD_TOKEN
    ? { Authorization: `JWT ${PAYLOAD_TOKEN}` }
    : PAYLOAD_API_KEY
      ? { Authorization: `users API-Key ${PAYLOAD_API_KEY}` }
      : {}),
}

interface LexicalNode {
  type: string
  version: number
  [key: string]: unknown
}

/** Convert a line of markdown text (with **bold** and inline formatting) to Lexical text nodes */
function parseInlineMarkdown(text: string): LexicalNode[] {
  const nodes: LexicalNode[] = []
  const regex = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    // Text before bold
    if (match.index > lastIndex) {
      nodes.push({
        type: 'text',
        version: 1,
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text: text.slice(lastIndex, match.index),
      })
    }
    // Bold text
    nodes.push({
      type: 'text',
      version: 1,
      detail: 0,
      format: 1, // bold
      mode: 'normal',
      style: '',
      text: match[1],
    })
    lastIndex = match.index + match[0].length
  }

  // Remaining text
  if (lastIndex < text.length) {
    nodes.push({
      type: 'text',
      version: 1,
      detail: 0,
      format: 0,
      mode: 'normal',
      style: '',
      text: text.slice(lastIndex),
    })
  }

  return nodes
}

/** Convert markdown string to Lexical root JSON */
function markdownToLexical(markdown: string): object {
  const lines = markdown.split('\n')
  const children: LexicalNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      children.push({
        type: 'heading',
        version: 1,
        tag: `h${level}`,
        direction: 'ltr',
        format: '',
        indent: 0,
        children: parseInlineMarkdown(headingMatch[2]),
      })
      i++
      continue
    }

    // Unordered list items (collect consecutive)
    if (line.match(/^- .+/)) {
      const listItems: LexicalNode[] = []
      while (i < lines.length && lines[i].match(/^- .+/)) {
        const itemText = lines[i].replace(/^- /, '')
        listItems.push({
          type: 'listitem',
          version: 1,
          direction: 'ltr',
          format: '',
          indent: 0,
          value: listItems.length + 1,
          children: [
            {
              type: 'paragraph',
              version: 1,
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              textStyle: '',
              children: parseInlineMarkdown(itemText),
            },
          ],
        })
        i++
      }
      children.push({
        type: 'list',
        version: 1,
        listType: 'bullet',
        direction: 'ltr',
        format: '',
        indent: 0,
        tag: 'ul',
        start: 1,
        children: listItems,
      })
      continue
    }

    // Empty line — skip
    if (line.trim() === '') {
      i++
      continue
    }

    // Regular paragraph
    children.push({
      type: 'paragraph',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      textFormat: 0,
      textStyle: '',
      children: parseInlineMarkdown(line),
    })
    i++
  }

  return {
    root: {
      type: 'root',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      children,
    },
  }
}

const MDX_GLOBALS = [
  { dir: 'privacy-page', slug: 'privacy-page' },
  { dir: 'terms-page', slug: 'terms-page' },
]

async function main(): Promise<void> {
  const singletonsDir = path.resolve(import.meta.dirname, '../src/content/singletons')

  for (const { dir, slug } of MDX_GLOBALS) {
    const mdxPath = path.join(singletonsDir, dir, 'index.mdx')
    if (!fs.existsSync(mdxPath)) {
      console.warn(`SKIP: ${mdxPath} not found`)
      continue
    }

    const content = fs.readFileSync(mdxPath, 'utf-8')
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!fmMatch) {
      console.error(`FAIL: Could not parse frontmatter in ${mdxPath}`)
      continue
    }

    const frontmatter = YAML.parse(fmMatch[1]) as Record<string, unknown>
    const body = fmMatch[2].trim()
    const lexicalBody = markdownToLexical(body)

    const payload = {
      title: frontmatter.title,
      lastUpdated: frontmatter.lastUpdated,
      body: lexicalBody,
      _status: 'published',
    }

    const res = await fetch(`${PAYLOAD_URL}/api/globals/${slug}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`FAIL: ${slug} - ${res.status} ${text.slice(0, 300)}`)
    } else {
      console.log(`OK: ${slug} (published)`)
    }
  }

  console.log('\nDone.')
}

main().catch((err: unknown) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
