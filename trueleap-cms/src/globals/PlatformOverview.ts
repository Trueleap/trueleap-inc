import type { GlobalConfig } from 'payload'
import { ctaSectionField } from '../fields/cta'
import { heroWithCtaField } from '../fields/hero'

export const PlatformOverview: GlobalConfig = {
  slug: 'platform-overview',
  label: 'Platform Overview',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    heroWithCtaField(),
    {
      name: 'platformAreas',
      type: 'array',
      labels: { singular: 'Area', plural: 'Areas' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'href', type: 'text' },
        {
          name: 'features',
          type: 'array',
          labels: { singular: 'Feature', plural: 'Features' },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        { name: 'metric', type: 'text' },
        { name: 'metricLabel', type: 'text' },
      ],
    },
    {
      name: 'specs',
      type: 'array',
      labels: { singular: 'Spec', plural: 'Specs' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'detail', type: 'text' },
      ],
    },
    {
      name: 'architectureLayers',
      type: 'array',
      labels: { singular: 'Layer', plural: 'Layers' },
      fields: [
        { name: 'layer', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },
    ctaSectionField(),
  ],
}
