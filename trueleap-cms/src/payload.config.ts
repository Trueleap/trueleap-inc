import fs from 'fs'
import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { PayloadAiPluginLexicalEditorFeature, payloadAiPlugin } from '@ai-stack/payloadcms'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import type { CloudflareContext } from '@opennextjs/cloudflare'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'

import type { CollectionConfig, GlobalConfig, CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

import {
  Users,
  Media,
  CaseStudies,
  News,
  Team,
  Partners,
  Jobs,
  Testimonials,
  IndustrySolutions,
  OutcomeSolutions,
} from './collections'

import {
  SiteSettings,
  Navigation,
  Homepage,
  CompanyOverview,
  MissionPage,
  CareersPage,
  PlatformOverview,
  InfrastructurePage,
  DigitalSystemsPage,
  EdgeAiPage,
  StackPage,
  SolutionsOverview,
  ImpactOverview,
  CaseStudiesPage,
  MetricsPage,
  NetworkMapPage,
  TrustCenterPage,
  NewsroomPage,
  DocsPage,
  LastMilePage,
  ResourcesOverview,
  PrivacyPage,
  TermsPage,
} from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const realpath = (value: string): string | undefined =>
  fs.existsSync(value) ? fs.realpathSync(value) : undefined

const isCLI = process.argv.some((value) => {
  const resolved = realpath(value)
  return resolved !== undefined && resolved.endsWith(path.join('payload', 'bin.js'))
})
const isProduction = process.env.NODE_ENV === 'production'

const cloudflare: CloudflareContext =
  isCLI || !isProduction
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4321'
const PREVIEW_URL = process.env.PREVIEW_URL || 'http://localhost:4322'

const globalUrlMap: Record<string, string> = {
  homepage: '/en',
  'company-overview': '/en/company',
  'mission-page': '/en/company/mission',
  'careers-page': '/en/company/careers',
  'platform-overview': '/en/platform',
  'infrastructure-page': '/en/platform/infrastructure',
  'digital-systems-page': '/en/platform/digital-systems',
  'edge-ai-page': '/en/platform/edge-ai',
  'stack-page': '/en/platform/stack',
  'solutions-overview': '/en/solutions',
  'impact-overview': '/en/impact',
  'case-studies-page': '/en/impact/case-studies',
  'metrics-page': '/en/impact/metrics',
  'network-map-page': '/en/impact/network-map',
  'trust-center-page': '/en/resources/trust-center',
  'newsroom-page': '/en/resources/newsroom',
  'docs-page': '/en/resources/docs',
  'last-mile-page': '/en/impact/last-mile',
  'resources-overview': '/en/resources',
  'privacy-page': '/en/privacy',
  'terms-page': '/en/terms',
}

const collectionUrlMap: Record<string, string> = {
  'industry-solutions': '/en/solutions/industry',
  'outcome-solutions': '/en/solutions/outcome',
}

const draftVersions = {
  drafts: true,
}

/** Trigger a site rebuild when content is published via Payload's native publish button */
const triggerDeployOnPublish = async (req: { payload: { logger: { info: Function; error: Function } } }) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? ''
  const GITHUB_REPO = process.env.GITHUB_REPO ?? 'Trueleap/trueleap-inc'
  if (!GITHUB_TOKEN) {
    req.payload.logger.error('GITHUB_TOKEN not set — cannot trigger deploy')
    return
  }
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'trueleap-cms',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ event_type: 'payload-publish' }),
    })
    if (res.ok || res.status === 204) {
      req.payload.logger.info('Deploy triggered after publish')
    } else {
      const text = await res.text()
      req.payload.logger.error(`Deploy trigger failed: ${res.status} ${text}`)
    }
  } catch (e) {
    req.payload.logger.error(`Failed to trigger deploy after publish: ${e}`)
  }
}

const collectionAfterChangeHook: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (doc._status === 'published') {
    await triggerDeployOnPublish(req)
  }
  return doc
}

const globalAfterChangeHook: GlobalAfterChangeHook = async ({ doc, req }) => {
  if (doc._status === 'published') {
    await triggerDeployOnPublish(req)
  }
  return doc
}

const groupGlobals = (group: string, globals: GlobalConfig[]): GlobalConfig[] =>
  globals.map((g) => ({
    ...g,
    versions: draftVersions,
    hooks: {
      ...(g.hooks ?? {}),
      afterChange: [...(g.hooks?.afterChange ?? []), globalAfterChangeHook],
    },
    admin: {
      ...(g.admin ?? {}),
      group,
      preview: () => {
        const pagePath = globalUrlMap[g.slug]
        return pagePath ? `${PREVIEW_URL}${pagePath}` : null
      },
    },
  }))

const groupCollections = (group: string, collections: CollectionConfig[]): CollectionConfig[] =>
  collections.map((c) => ({
    ...c,
    versions: draftVersions,
    hooks: {
      ...(c.hooks ?? {}),
      afterChange: [...(c.hooks?.afterChange ?? []), collectionAfterChangeHook],
    },
    admin: {
      ...(c.admin ?? {}),
      group,
      preview: (doc: Record<string, unknown>) => {
        const basePath = collectionUrlMap[c.slug]
        if (basePath && doc?.title) {
          const slug = String(doc.title).toLowerCase().replace(/\s+/g, '-')
          return `${PREVIEW_URL}${basePath}/${slug}`
        }
        return null
      },
    },
  }))

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'light',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — TrueLeap CMS',
      icons: [{ type: 'image/svg+xml', url: '/favicon.svg' }],
    },
    components: {
      beforeNavLinks: ['@/components/DashboardLink'],
      actions: ['@/components/DraftBanner'],
      graphics: {
        Logo: '@/components/Logo',
        Icon: '@/components/Icon',
      },
    },

  },
  collections: [
    Users,
    Media,
    ...groupCollections('Content', [
      CaseStudies,
      News,
      Team,
      Partners,
      Jobs,
      Testimonials,
      IndustrySolutions,
      OutcomeSolutions,
    ]),
  ],
  globals: [
    ...groupGlobals('Pages', [
      Homepage,
      CompanyOverview,
      MissionPage,
      CareersPage,
      PlatformOverview,
      InfrastructurePage,
      DigitalSystemsPage,
      EdgeAiPage,
      StackPage,
      SolutionsOverview,
      ImpactOverview,
      CaseStudiesPage,
      MetricsPage,
      NetworkMapPage,
      LastMilePage,
      ResourcesOverview,
      TrustCenterPage,
      NewsroomPage,
      DocsPage,
      PrivacyPage,
      TermsPage,
    ]),
    ...groupGlobals('Settings', [
      SiteSettings,
      Navigation,
    ]),
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      PayloadAiPluginLexicalEditorFeature(),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
    payloadAiPlugin({
      collections: {
        'case-studies': true,
        news: true,
        team: true,
        partners: true,
        jobs: true,
        testimonials: true,
        'industry-solutions': true,
        'outcome-solutions': true,
      },
      globals: {
        homepage: true,
        'company-overview': true,
        'mission-page': true,
        'careers-page': true,
        'platform-overview': true,
        'infrastructure-page': true,
        'digital-systems-page': true,
        'edge-ai-page': true,
        'stack-page': true,
        'solutions-overview': true,
        'impact-overview': true,
        'case-studies-page': true,
        'metrics-page': true,
        'network-map-page': true,
        'last-mile-page': true,
        'resources-overview': true,
        'trust-center-page': true,
        'newsroom-page': true,
        'docs-page': true,
        'privacy-page': true,
        'terms-page': true,
      },
      access: {
        generate: ({ req }) => Boolean(req.user),
        settings: ({ req }) => (req.user as { role?: string } | null)?.role === 'admin',
      },
      generatePromptOnInit: true,
      debugging: !isProduction,
      seedPrompts: ({ path, fieldType, fieldLabel }) => {
        if (path.endsWith('.slug') || path.endsWith('.order')) return false
        if (path.endsWith('.body'))
          return {
            data: {
              prompt:
                'Write detailed, professional content about {{ title }} for a B2G technology company. Use clear, authoritative language.',
            },
          }
        if (path.endsWith('.description'))
          return {
            data: {
              prompt: 'Write a concise description for {{ title }} in a professional B2G tone.',
            },
          }
        if (path.endsWith('.bio'))
          return {
            data: { prompt: 'Write a professional bio for {{ name }}, {{ title }}.' },
          }
        if (path.endsWith('.summary'))
          return {
            data: {
              prompt: 'Summarize the key responsibilities and requirements for this {{ title }} position.',
            },
          }
        if (path.endsWith('.quote'))
          return {
            data: { prompt: 'Write a compelling, authentic-sounding testimonial quote.' },
          }
        // Default: always return { data } to avoid systemGenerate needing OpenAI/Anthropic keys
        return {
          data: {
            prompt: `Generate professional ${fieldType} content for the "${fieldLabel}" field based on {{ title }}.`,
          },
        }
      },
    }),
  ],
})

async function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }: { getPlatformProxy: (opts: GetPlatformProxyOptions) => Promise<CloudflareContext> }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: isProduction || process.env.USE_REMOTE_DB === 'true',
      } satisfies GetPlatformProxyOptions),
  )
}
