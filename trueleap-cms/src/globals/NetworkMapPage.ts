import type { GlobalConfig } from 'payload'
import { ctaSectionField } from '../fields/cta'
import { heroField } from '../fields/hero'

export const NetworkMapPage: GlobalConfig = {
  slug: 'network-map-page',
  label: 'Network Map Page',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    heroField(),
    {
      name: 'liveStats',
      type: 'array',
      labels: { singular: 'Stat', plural: 'Stats' },
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'suffix', type: 'text' },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'regionalDistribution',
      type: 'array',
      labels: { singular: 'Region', plural: 'Regions' },
      fields: [
        { name: 'region', type: 'text', required: true },
        { name: 'nodes', type: 'text' },
        { name: 'growth', type: 'text' },
        { name: 'description', type: 'text' },
      ],
    },
    {
      name: 'recentDeployments',
      type: 'array',
      labels: { singular: 'Deployment', plural: 'Deployments' },
      fields: [
        { name: 'location', type: 'text', required: true },
        { name: 'nodes', type: 'text' },
        { name: 'status', type: 'text' },
      ],
    },
    {
      name: 'networkArchitecture',
      type: 'array',
      labels: { singular: 'Item', plural: 'Items' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    ctaSectionField(),
  ],
}
