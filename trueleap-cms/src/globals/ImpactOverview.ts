import type { GlobalConfig } from 'payload'
import { ctaSectionField } from '../fields/cta'
import { heroField } from '../fields/hero'

export const ImpactOverview: GlobalConfig = {
  slug: 'impact-overview',
  label: 'Impact Overview',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    heroField(),
    {
      name: 'stats',
      type: 'array',
      labels: { singular: 'Stat', plural: 'Stats' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'navCards',
      type: 'array',
      labels: { singular: 'Card', plural: 'Cards' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'regionalHighlights',
      type: 'array',
      labels: { singular: 'Highlight', plural: 'Highlights' },
      fields: [
        { name: 'region', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'story', type: 'textarea' },
      ],
    },
    {
      name: 'testimonialQuote',
      type: 'group',
      fields: [
        { name: 'text', type: 'textarea' },
        { name: 'attribution', type: 'text' },
        { name: 'role', type: 'text' },
      ],
    },
    ctaSectionField(),
  ],
}
