/**
 * Migrate Keystatic singletons (JSON globals) to Payload CMS globals.
 *
 * Usage: npx tsx scripts/migrate-globals.ts
 *
 * Requires:
 *   PAYLOAD_URL - Payload CMS URL (default: http://localhost:3000)
 *   PAYLOAD_API_KEY - API key for authentication
 */

import fs from 'fs'
import path from 'path'

const PAYLOAD_URL = process.env.PAYLOAD_URL ?? 'http://localhost:3000'
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY ?? ''
const PAYLOAD_TOKEN = process.env.PAYLOAD_TOKEN ?? ''
const CONTENT_DIR = path.resolve(import.meta.dirname, '../src/content/singletons')

const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(PAYLOAD_TOKEN
    ? { Authorization: `JWT ${PAYLOAD_TOKEN}` }
    : PAYLOAD_API_KEY
      ? { Authorization: `users API-Key ${PAYLOAD_API_KEY}` }
      : {}),
}

/** JSON singletons → Payload globals (21 JSON + 2 MDX handled separately) */
const JSON_GLOBALS = [
  'site-settings',
  'navigation',
  'homepage',
  'company-overview',
  'mission-page',
  'careers-page',
  'platform-overview',
  'infrastructure-page',
  'digital-systems-page',
  'edge-ai-page',
  'stack-page',
  'solutions-overview',
  'impact-overview',
  'case-studies-page',
  'metrics-page',
  'network-map-page',
  'trust-center-page',
  'newsroom-page',
  'docs-page',
  'last-mile-page',
  'resources-overview',
]

/**
 * Recursively transform string[] arrays into {text: string}[] arrays.
 * Keystatic stores simple lists as ["a", "b"], but Payload arrays
 * always have named sub-fields, so we wrap as [{text: "a"}, {text: "b"}].
 */
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

async function migrateJsonGlobal(slug: string): Promise<void> {
  const filePath = path.join(CONTENT_DIR, `${slug}.json`)

  if (!fs.existsSync(filePath)) {
    console.warn(`  SKIP: ${filePath} does not exist`)
    return
  }

  const raw: unknown = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  const data = transformStringArrays(raw)

  const res = await fetch(`${PAYLOAD_URL}/api/globals/${slug}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`  FAIL: ${slug} - ${res.status} ${text}`)
    return
  }

  console.log(`  OK: ${slug}`)
}

async function main(): Promise<void> {
  console.log(`Migrating ${JSON_GLOBALS.length} JSON globals to ${PAYLOAD_URL}...\n`)

  for (const slug of JSON_GLOBALS) {
    await migrateJsonGlobal(slug)
  }

  console.log('\nDone. MDX globals (privacy-page, terms-page) require manual migration.')
}

main().catch((err: unknown) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
