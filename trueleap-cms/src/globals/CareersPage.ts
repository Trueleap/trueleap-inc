import type { GlobalConfig } from 'payload'
import { ctaField, simpleCtaSectionField } from '../fields/cta'

export const CareersPage: GlobalConfig = {
  slug: 'careers-page',
  label: 'Careers Page',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        { name: 'headlineAccent', type: 'text' },
        { name: 'description', type: 'textarea' },
        ctaField('ctaPrimary', 'Primary CTA'),
        ctaField('ctaSecondary', 'Secondary CTA'),
      ],
    },
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
      name: 'benefits',
      type: 'array',
      labels: { singular: 'Benefit', plural: 'Benefits' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'hiringProcess',
      type: 'array',
      labels: { singular: 'Step', plural: 'Steps' },
      fields: [
        { name: 'step', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },
    simpleCtaSectionField(),
  ],
}
