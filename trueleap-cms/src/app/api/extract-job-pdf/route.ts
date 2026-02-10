import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from '@payloadcms/richtext-lexical'

const DEPARTMENTS = ['Engineering', 'Product', 'Operations', 'Sales & Partnerships', 'People & Finance']
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract']

const EXTRACT_PROMPT = `You are a structured data extractor. Given a job description, extract the following fields as JSON. Return ONLY valid JSON, no extra text.

{
  "title": "job title (short, e.g. 'Senior Software Engineer')",
  "department": "one of: ${DEPARTMENTS.join(', ')}",
  "location": "job location (e.g. 'Remote', 'New York, NY')",
  "type": "one of: ${JOB_TYPES.join(', ')}",
  "summary": "1-2 sentence summary of the role for a card listing"
}

If a field cannot be determined, use an empty string. For department, pick the closest match.`

function parseFields(raw: string) {
  const empty = { title: '', department: '', location: '', type: '', summary: '' }
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return empty
  try {
    const parsed = JSON.parse(jsonMatch[0])
    return {
      title: String(parsed.title || '').trim(),
      department: DEPARTMENTS.includes(parsed.department) ? parsed.department : '',
      location: String(parsed.location || '').trim(),
      type: JOB_TYPES.includes(parsed.type) ? parsed.type : '',
      summary: String(parsed.summary || '').trim(),
    }
  } catch {
    return empty
  }
}

const CF_ACCOUNT_ID = 'b01357b51e0ceb9e37e2bdf82bbcbc34'
const isProduction = process.env.NODE_ENV === 'production'

/**
 * Get AI interface — works in both local dev and production.
 *
 * Production (CF Worker): uses native AI binding via getCloudflareContext.
 * Local dev: uses Workers AI REST API (no remote proxy needed, avoids
 * the DATABASE_ID placeholder issue with getPlatformProxy remoteBindings).
 */
async function getAI(): Promise<{
  toMarkdown: (files: Array<{ name: string; blob: Blob }>) => Promise<Array<{ data: string }>>;
  run: (model: string, input: any) => Promise<any>;
} | null> {
  if (isProduction) {
    // Production: running as CF Worker, bindings available natively
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const cf = await getCloudflareContext({ async: true })
    return cf.env.AI as any
  }

  // Local dev: use Workers AI REST API directly
  const apiToken = process.env.CLOUDFLARE_API_TOKEN
  if (!apiToken) return null

  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai`
  const headers = { Authorization: `Bearer ${apiToken}` }

  return {
    async toMarkdown(files) {
      // Workers AI toMarkdown via REST — send as multipart form
      const form = new FormData()
      for (const file of files) {
        form.append('files', file.blob, file.name)
      }
      const res = await fetch(`${baseUrl}/toMarkdown`, { method: 'POST', headers, body: form })
      if (!res.ok) throw new Error(`toMarkdown API: HTTP ${res.status} ${await res.text()}`)
      const json = await res.json() as any
      return json.result || []
    },
    async run(model, input) {
      const res = await fetch(`${baseUrl}/run/${model}`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) throw new Error(`AI run API: HTTP ${res.status} ${await res.text()}`)
      const json = await res.json() as any
      return json.result || {}
    },
  }
}

export async function POST(req: Request) {
  // Auth: require logged-in Payload user
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const mediaId = body?.mediaId
  if (!mediaId) {
    return NextResponse.json({ error: 'mediaId is required' }, { status: 400 })
  }

  // Fetch media doc to get the URL
  let mediaDoc: any
  try {
    mediaDoc = await payload.findByID({ collection: 'media', id: mediaId })
  } catch {
    return NextResponse.json({ error: 'Media not found' }, { status: 404 })
  }

  if (!mediaDoc?.url) {
    return NextResponse.json({ error: 'Media has no URL' }, { status: 400 })
  }

  if (mediaDoc.mimeType !== 'application/pdf') {
    return NextResponse.json({ error: 'Media is not a PDF' }, { status: 400 })
  }

  // Get AI
  let ai: Awaited<ReturnType<typeof getAI>>
  try {
    ai = await getAI()
  } catch (err: any) {
    return NextResponse.json({ error: `AI unavailable: ${err.message}` }, { status: 500 })
  }

  if (!ai) {
    return NextResponse.json(
      { error: 'AI not available. In local dev, set CLOUDFLARE_API_TOKEN in .env' },
      { status: 500 },
    )
  }

  // Read PDF directly from R2 (avoids relative URL issue in Workers)
  let pdfBuffer: ArrayBuffer
  try {
    if (isProduction) {
      // Production: read directly from R2 binding (same Worker, no network hop)
      const { getCloudflareContext } = await import('@opennextjs/cloudflare')
      const cf = await getCloudflareContext({ async: true })
      const r2 = cf.env.R2 as any
      const obj = await r2.get(mediaDoc.filename) as { arrayBuffer(): Promise<ArrayBuffer> } | null
      if (!obj) throw new Error(`R2 object not found: ${mediaDoc.filename}`)
      pdfBuffer = await obj.arrayBuffer()
    } else {
      // Local dev: resolve relative URL against request origin
      const origin = new URL(req.url).origin
      const absoluteUrl = new URL(mediaDoc.url, origin).href
      const pdfRes = await fetch(absoluteUrl)
      if (!pdfRes.ok) throw new Error(`HTTP ${pdfRes.status}`)
      pdfBuffer = await pdfRes.arrayBuffer()
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Failed to fetch PDF: ${err.message}` }, { status: 500 })
  }

  // Extract markdown from PDF via Workers AI
  let markdown = ''
  try {
    const result = await ai.toMarkdown([{
      name: mediaDoc.filename || 'document.pdf',
      blob: new Blob([pdfBuffer], { type: 'application/pdf' }),
    }])
    markdown = result?.[0]?.data || ''
  } catch (err: any) {
    return NextResponse.json({ error: `PDF text extraction failed: ${err.message}` }, { status: 500 })
  }

  if (!markdown) {
    return NextResponse.json({ error: 'No text could be extracted from this PDF' }, { status: 422 })
  }

  // Extract structured fields via Workers AI
  let fields = { title: '', department: '', location: '', type: '', summary: '' }
  try {
    const result = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { role: 'system', content: EXTRACT_PROMPT },
        { role: 'user', content: markdown.slice(0, 6000) },
      ],
      max_tokens: 512,
    })
    fields = parseFields(result?.response || '')
  } catch {
    // Fields stay empty — markdown body is still useful
  }

  // Convert markdown to Lexical JSON for the body richText field
  let lexicalBody = null
  try {
    const payloadConfig = await config
    const editorConfig = await editorConfigFactory.default({ config: payloadConfig })
    lexicalBody = convertMarkdownToLexical({ editorConfig, markdown })
  } catch (err: any) {
    console.error('Lexical conversion failed:', err?.message || err)
  }

  return NextResponse.json({ ok: true, fields, lexicalBody, markdown })
}
