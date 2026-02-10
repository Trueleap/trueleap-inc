/**
 * Payload CMS REST API client for the Astro frontend.
 *
 * Works in both modes:
 * - Static build (customer site): uses import.meta.env (inlined at build time)
 * - SSR on Cloudflare Workers (preview site): uses Astro.locals.runtime.env
 *   and the CMS Service Binding to avoid Worker-to-Worker 522 timeouts
 *
 * Pages should call `getPayload(Astro)` to get a properly configured client.
 */

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

interface EnvConfig {
  payloadUrl: string
  payloadApiKey: string
  draftMode: boolean
  /** Cloudflare Service Binding to CMS worker (avoids public network hop) */
  cmsBinding?: { fetch: typeof fetch }
}

function resolveEnv(astroInstance?: { locals: { runtime?: { env?: Record<string, unknown> } } }): EnvConfig {
  // Try Cloudflare runtime env first (SSR), fall back to import.meta.env (static build)
  const runtimeEnv = astroInstance?.locals?.runtime?.env
  return {
    payloadUrl: (runtimeEnv?.PAYLOAD_URL as string) ?? import.meta.env.PAYLOAD_URL ?? 'http://localhost:3000',
    payloadApiKey: (runtimeEnv?.PAYLOAD_API_KEY as string) ?? import.meta.env.PAYLOAD_API_KEY ?? '',
    draftMode: ((runtimeEnv?.DRAFT_MODE as string) ?? import.meta.env.DRAFT_MODE) === 'true',
    // CMS Service Binding (set in wrangler.toml as [[services]] binding = "CMS")
    cmsBinding: runtimeEnv?.CMS as { fetch: typeof fetch } | undefined,
  }
}

async function payloadFetch<T>(env: EnvConfig, path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`/api${path}`, env.payloadUrl)

  if (options.depth !== undefined) url.searchParams.set('depth', String(options.depth))
  if (options.limit !== undefined) url.searchParams.set('limit', String(options.limit))
  if (options.draft) url.searchParams.set('draft', 'true')
  if (options.sort) url.searchParams.set('sort', options.sort)
  if (options.where) url.searchParams.set('where', JSON.stringify(options.where))

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (env.payloadApiKey) {
    headers['Authorization'] = `users API-Key ${env.payloadApiKey}`
  }

  // Use Service Binding if available (Worker-to-Worker, no public network hop)
  // Fall back to global fetch for static builds / local dev
  const fetcher = env.cmsBinding?.fetch?.bind(env.cmsBinding) ?? fetch
  const res = await fetcher(url.toString(), { headers })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Payload API error: ${res.status} ${res.statusText} on ${path} — ${body.slice(0, 200)}`)
  }

  return res.json() as Promise<T>
}

/** Read a Payload global (singleton) */
async function readGlobal<T>(env: EnvConfig, slug: string, options?: RequestOptions): Promise<T | null> {
  try {
    return await payloadFetch<T>(env, `/globals/${slug}`, options)
  } catch (err) {
    console.error(`[payload] readGlobal("${slug}") failed:`, err)
    console.error(`[payload] env: url=${env.payloadUrl}, key=${env.payloadApiKey ? 'SET' : 'MISSING'}, draft=${env.draftMode}, binding=${env.cmsBinding ? 'YES' : 'NO'}`)
    return null
  }
}

/** List all documents in a Payload collection */
async function listCollection<T>(
  env: EnvConfig,
  slug: string,
  options: RequestOptions = {},
): Promise<T[]> {
  const res = await payloadFetch<PayloadListResponse<T>>(
    env,
    `/${slug}`,
    { limit: 100, ...options },
  )
  return res.docs
}

/** Read a single document from a Payload collection by ID */
async function readCollectionById<T>(
  env: EnvConfig,
  slug: string,
  id: string | number,
  options?: RequestOptions,
): Promise<T | null> {
  try {
    return await payloadFetch<T>(env, `/${slug}/${id}`, options)
  } catch {
    return null
  }
}

/**
 * Find a single document by field value (typically slug/title).
 * Uses Payload where queries.
 */
async function findOne<T>(
  env: EnvConfig,
  collectionSlug: string,
  field: string,
  value: string,
  options?: RequestOptions,
): Promise<T | null> {
  const res = await payloadFetch<PayloadListResponse<T>>(env, `/${collectionSlug}`, {
    ...options,
    limit: 1,
    where: { [field]: { equals: value } },
  })
  return res.docs[0] ?? null
}

/** Create a payload client bound to a specific env config */
function createClient(env: EnvConfig, defaults: RequestOptions = {}) {
  return {
    globals: {
      read: <T>(slug: string, options?: RequestOptions) =>
        readGlobal<T>(env, slug, { ...defaults, ...options }),
    },
    collections: {
      list: <T>(slug: string, options?: RequestOptions) =>
        listCollection<T>(env, slug, { ...defaults, ...options }),
      readById: <T>(slug: string, id: string | number, options?: RequestOptions) =>
        readCollectionById<T>(env, slug, id, { ...defaults, ...options }),
      findOne: <T>(slug: string, field: string, value: string, options?: RequestOptions) =>
        findOne<T>(env, slug, field, value, { ...defaults, ...options }),
    },
  }
}

/**
 * Get a Payload client configured for the current environment.
 *
 * Usage in Astro pages:
 *   const cms = getPayload(Astro)
 *   const page = await cms.globals.read('homepage')
 */
export function getPayload(astroInstance?: { locals: { runtime?: { env?: Record<string, unknown> } } }) {
  const env = resolveEnv(astroInstance)
  return createClient(env, env.draftMode ? { draft: true } : {})
}

/**
 * Default client for backward compatibility (uses import.meta.env only).
 * Works for static builds. For SSR, use getPayload(Astro) instead.
 */
export const payload = getPayload()
