import type { GlobalConfig } from 'payload'
import { ctaSectionField } from '../fields/cta'
import { heroWithCtaField } from '../fields/hero'

export const DigitalSystemsPage: GlobalConfig = {
  slug: 'digital-systems-page',
  label: 'Digital Systems Page',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    heroWithCtaField(),
    {
      name: 'systems',
      type: 'array',
      labels: { singular: 'System', plural: 'Systems' },
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'features',
          type: 'array',
          labels: { singular: 'Feature', plural: 'Features' },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'integrationBenefits',
      type: 'array',
      labels: { singular: 'Benefit', plural: 'Benefits' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'useCases',
      type: 'array',
      labels: { singular: 'Use Case', plural: 'Use Cases' },
      fields: [
        { name: 'category', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    ctaSectionField(),
  ],
}
