/**
 * Payload CMS REST API client for the Astro frontend.
 *
 * All pages use `export const prerender = true` (static build).
 * The Payload CMS runs at PAYLOAD_URL (e.g. https://cms.trueleapinc.com).
 */

const PAYLOAD_URL = import.meta.env.PAYLOAD_URL ?? 'http://localhost:3000'
const PAYLOAD_API_KEY = import.meta.env.PAYLOAD_API_KEY ?? ''

interface PayloadListResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

interface RequestOptions {
  draft?: boolean
  depth?: number
  limit?: number
  where?: Record<string, unknown>
  sort?: string
}

async function payloadFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`/api${path}`, PAYLOAD_URL)

  if (options.depth !== undefined) url.searchParams.set('depth', String(options.depth))
  if (options.limit !== undefined) url.searchParams.set('limit', String(options.limit))
  if (options.draft) url.searchParams.set('draft', 'true')
  if (options.sort) url.searchParams.set('sort', options.sort)
  if (options.where) url.searchParams.set('where', JSON.stringify(options.where))

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (PAYLOAD_API_KEY) {
    headers['Authorization'] = `users API-Key ${PAYLOAD_API_KEY}`
  }

  const res = await fetch(url.toString(), { headers })

  if (!res.ok) {
    throw new Error(`Payload API error: ${res.status} ${res.statusText} on ${path}`)
  }

  return res.json() as Promise<T>
}

/** Read a Payload global (singleton) */
async function readGlobal<T>(slug: string, options?: RequestOptions): Promise<T | null> {
  try {
    return await payloadFetch<T>(`/globals/${slug}`, options)
  } catch {
    return null
  }
}

/** List all documents in a Payload collection */
async function listCollection<T>(
  slug: string,
  options: RequestOptions = {},
): Promise<T[]> {
  const res = await payloadFetch<PayloadListResponse<T>>(
    `/${slug}`,
    { limit: 100, ...options },
  )
  return res.docs
}

/** Read a single document from a Payload collection by ID */
async function readCollectionById<T>(
  slug: string,
  id: string | number,
  options?: RequestOptions,
): Promise<T | null> {
  try {
    return await payloadFetch<T>(`/${slug}/${id}`, options)
  } catch {
    return null
  }
}

/**
 * Find a single document by field value (typically slug/title).
 * Uses Payload where queries.
 */
async function findOne<T>(
  collectionSlug: string,
  field: string,
  value: string,
  options?: RequestOptions,
): Promise<T | null> {
  const res = await payloadFetch<PayloadListResponse<T>>(`/${collectionSlug}`, {
    ...options,
    limit: 1,
    where: { [field]: { equals: value } },
  })
  return res.docs[0] ?? null
}

/** Create a payload client — pass `{ draft: true }` for preview mode */
function createClient(defaults: RequestOptions = {}) {
  return {
    globals: {
      read: <T>(slug: string, options?: RequestOptions) =>
        readGlobal<T>(slug, { ...defaults, ...options }),
    },
    collections: {
      list: <T>(slug: string, options?: RequestOptions) =>
        listCollection<T>(slug, { ...defaults, ...options }),
      readById: <T>(slug: string, id: string | number, options?: RequestOptions) =>
        readCollectionById<T>(slug, id, { ...defaults, ...options }),
      findOne: <T>(slug: string, field: string, value: string, options?: RequestOptions) =>
        findOne<T>(slug, field, value, { ...defaults, ...options }),
    },
  }
}

/**
 * DRAFT_MODE env var controls draft fetching:
 * - Customer site (dev.trueleapinc.com): not set → published content
 * - Preview site (dev-preview.trueleapinc.com): "true" → draft content
 */
const DRAFT_MODE = import.meta.env.DRAFT_MODE === 'true'

export const payload = createClient(DRAFT_MODE ? { draft: true } : {})
