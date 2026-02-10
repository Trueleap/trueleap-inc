import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  serverExternalPackages: ['jose', 'pg-cloudflare'],
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
