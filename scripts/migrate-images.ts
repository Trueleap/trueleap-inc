/**
 * Migrate images from public/images/ to Payload CMS media collection.
 *
 * Usage: npx tsx scripts/migrate-images.ts
 *
 * This uploads all images in public/images/ to Payload's media collection
 * and outputs a mapping of original paths → Payload media IDs.
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
const IMAGES_DIR = path.resolve(import.meta.dirname, '../public/images')
const OUTPUT_MAP = path.resolve(import.meta.dirname, '../scripts/image-map.json')

const authHeaders: Record<string, string> = PAYLOAD_TOKEN
  ? { Authorization: `JWT ${PAYLOAD_TOKEN}` }
  : PAYLOAD_API_KEY
    ? { Authorization: `users API-Key ${PAYLOAD_API_KEY}` }
    : {}

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'])

function collectImages(dir: string, basePath: string = ''): string[] {
  const results: string[] = []
  if (!fs.existsSync(dir)) return results

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relativePath = path.join(basePath, entry.name)
    if (entry.isDirectory()) {
      results.push(...collectImages(path.join(dir, entry.name), relativePath))
    } else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      results.push(relativePath)
    }
  }
  return results
}

async function uploadImage(
  relativePath: string,
): Promise<{ id: string; url: string } | null> {
  const fullPath = path.join(IMAGES_DIR, relativePath)
  const fileBuffer = fs.readFileSync(fullPath)
  const fileName = path.basename(relativePath)

  const formData = new FormData()
  const blob = new Blob([fileBuffer])
  formData.append('file', blob, fileName)
  formData.append('alt', fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))

  const res = await fetch(`${PAYLOAD_URL}/api/media`, {
    method: 'POST',
    headers: authHeaders,
    body: formData,
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`  FAIL: ${relativePath} - ${res.status} ${text.slice(0, 200)}`)
    return null
  }

  const data = (await res.json()) as { doc: { id: string; url: string } }
  return { id: data.doc.id, url: data.doc.url }
}

async function main(): Promise<void> {
  console.log(`Scanning ${IMAGES_DIR} for images...\n`)

  const images = collectImages(IMAGES_DIR)
  console.log(`Found ${images.length} images.\n`)

  const imageMap: Record<string, { id: string; url: string }> = {}

  for (const relativePath of images) {
    const publicPath = `/images/${relativePath}`
    console.log(`  Uploading: ${publicPath}`)

    const result = await uploadImage(relativePath)
    if (result) {
      imageMap[publicPath] = result
      console.log(`    → ID: ${result.id}`)
    }
  }

  // Save the mapping for use by other scripts
  fs.writeFileSync(OUTPUT_MAP, JSON.stringify(imageMap, null, 2))
  console.log(`\nImage map saved to ${OUTPUT_MAP}`)
  console.log(`Total: ${Object.keys(imageMap).length}/${images.length} uploaded successfully`)
}

main().catch((err: unknown) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
