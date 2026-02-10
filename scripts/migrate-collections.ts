/**
 * Migrate Keystatic collections (JSON + MDX) to Payload CMS collections.
 *
 * Usage: npx tsx scripts/migrate-collections.ts
 *
 * Requires:
 *   PAYLOAD_URL - Payload CMS URL (default: http://localhost:3000)
 *   PAYLOAD_API_KEY - API key for authentication
 */

import fs from 'fs'
import path from 'path'
import YAML from 'yaml'

const PAYLOAD_URL = process.env.PAYLOAD_URL ?? 'http://localhost:3000'
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY ?? ''
const PAYLOAD_TOKEN = process.env.PAYLOAD_TOKEN ?? ''
const CONTENT_DIR = path.resolve(import.meta.dirname, '../src/content')

const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(PAYLOAD_TOKEN
    ? { Authorization: `JWT ${PAYLOAD_TOKEN}` }
    : PAYLOAD_API_KEY
      ? { Authorization: `users API-Key ${PAYLOAD_API_KEY}` }
      : {}),
}

interface CollectionConfig {
  /** Keystatic collection directory name */
  dir: string
  /** Payload collection slug */
  slug: string
  /** Whether entries use MDX format (directory with index.mdx) */
  mdx: boolean
  /** Keystatic uses `fields.slug()` with this as useAsTitle */
  titleField: string
}

const COLLECTIONS: CollectionConfig[] = [
  { dir: 'team', slug: 'team', mdx: false, titleField: 'name' },
  { dir: 'partners', slug: 'partners', mdx: false, titleField: 'name' },
  { dir: 'testimonials', slug: 'testimonials', mdx: false, titleField: 'attribution' },
  { dir: 'case-studies', slug: 'case-studies', mdx: true, titleField: 'title' },
  { dir: 'news', slug: 'news', mdx: true, titleField: 'title' },
  { dir: 'jobs', slug: 'jobs', mdx: true, titleField: 'title' },
  { dir: 'industry-solutions', slug: 'industry-solutions', mdx: true, titleField: 'title' },
  { dir: 'outcome-solutions', slug: 'outcome-solutions', mdx: true, titleField: 'title' },
]

/** Wrap string[] arrays as {text: string}[] for Payload */
function transformStringArrays(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    if (obj.length > 0 && obj.every((item) => typeof item === 'string')) {
      return obj.map((item) => ({ text: item }))
    }
    return obj.map(transformStringArrays)
  }
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = transformStringArrays(value)
    }
    return result
  }
  return obj
}

function readJsonEntry(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, unknown>
}

function readMdxEntry(dirPath: string): Record<string, unknown> {
  const mdxPath = path.join(dirPath, 'index.mdx')
  if (!fs.existsSync(mdxPath)) {
    const jsonFiles = fs.readdirSync(dirPath).filter((f: string) => f.endsWith('.json'))
    if (jsonFiles.length > 0) {
      return readJsonEntry(path.join(dirPath, jsonFiles[0]))
    }
    console.warn(`  WARN: No index.mdx found in ${dirPath}`)
    return {}
  }

  const content = fs.readFileSync(mdxPath, 'utf-8')

  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!fmMatch) {
    console.warn(`  WARN: Could not parse frontmatter in ${mdxPath}`)
    return { _body: content }
  }

  const frontmatter = YAML.parse(fmMatch[1]) as Record<string, unknown>
  const body = fmMatch[2].trim()
  return { ...frontmatter, _body: body }
}

async function migrateCollection(config: CollectionConfig): Promise<void> {
  const collectionDir = path.join(CONTENT_DIR, config.dir)
  if (!fs.existsSync(collectionDir)) {
    console.warn(`  SKIP: ${collectionDir} does not exist`)
    return
  }

  const entries = fs.readdirSync(collectionDir)
  console.log(`  Found ${entries.length} entries in ${config.dir}`)

  for (const entry of entries) {
    const entryPath = path.join(collectionDir, entry)
    const stat = fs.statSync(entryPath)

    let data: Record<string, unknown>

    if (config.mdx && stat.isDirectory()) {
      data = readMdxEntry(entryPath)
    } else if (!config.mdx && entry.endsWith('.json')) {
      data = readJsonEntry(entryPath)
    } else {
      continue
    }

    // Use the directory/file name as the slug identifier
    const slug = entry.replace(/\.json$/, '')
    data._slug = slug

    // For collections with slug fields, the title is derived from the slug
    if (!data[config.titleField] && config.titleField === 'title') {
      data.title = slug
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    }

    // Remove the Keystatic body (MDX) — Lexical conversion needed separately
    const mdxBody = data._body as string | undefined
    delete data._body
    delete data._slug

    // Remove image paths (these need separate media migration)
    // Keep them as references for now
    if (data.image && typeof data.image === 'string') {
      data._originalImage = data.image
      delete data.image
    }
    if (data.logo && typeof data.logo === 'string') {
      data._originalLogo = data.logo
      delete data.logo
    }

    const transformed = transformStringArrays(data) as Record<string, unknown>

    const res = await fetch(`${PAYLOAD_URL}/api/${config.slug}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(transformed),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`    FAIL: ${slug} - ${res.status} ${text.slice(0, 200)}`)
      continue
    }

    if (mdxBody) {
      console.log(`    OK: ${slug} (body MDX needs manual Lexical conversion)`)
    } else {
      console.log(`    OK: ${slug}`)
    }
  }
}

async function main(): Promise<void> {
  console.log(`Migrating collections to ${PAYLOAD_URL}...\n`)

  // Migrate in order: simple JSON first, then MDX collections
  for (const config of COLLECTIONS) {
    console.log(`\n[${config.slug}]`)
    await migrateCollection(config)
  }

  console.log('\n\nDone.')
  console.log('Notes:')
  console.log('  - Image references need separate migration (run migrate-images.ts first)')
  console.log('  - MDX body content needs Lexical conversion (see mdx-to-lexical.ts)')
}

main().catch((err: unknown) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
