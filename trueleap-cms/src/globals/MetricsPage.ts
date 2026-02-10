import type { GlobalConfig } from 'payload'
import { ctaSectionField } from '../fields/cta'
import { heroField } from '../fields/hero'

export const MetricsPage: GlobalConfig = {
  slug: 'metrics-page',
  label: 'Metrics Page',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    heroField(),
    {
      name: 'primaryMetrics',
      type: 'array',
      labels: { singular: 'Metric', plural: 'Metrics' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'secondaryMetrics',
      type: 'array',
      labels: { singular: 'Metric', plural: 'Metrics' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'impactStories',
      type: 'array',
      labels: { singular: 'Story', plural: 'Stories' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'methodology',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    ctaSectionField(),
  ],
}
