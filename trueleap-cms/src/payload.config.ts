import fs from 'fs'
import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import type { CloudflareContext } from '@opennextjs/cloudflare'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'

import type { CollectionConfig, GlobalConfig } from 'payload'

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

const groupGlobals = (group: string, globals: GlobalConfig[]): GlobalConfig[] =>
  globals.map((g) => ({
    ...g,
    versions: draftVersions,
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
  editor: lexicalEditor(),
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
  ],
})

async function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }: { getPlatformProxy: (opts: GetPlatformProxyOptions) => Promise<CloudflareContext> }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: isProduction,
      } satisfies GetPlatformProxyOptions),
  )
}
