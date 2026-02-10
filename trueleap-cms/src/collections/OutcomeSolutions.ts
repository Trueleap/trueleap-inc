import type { CollectionConfig } from 'payload'
import { ctaField, ctaSectionField } from '../fields/cta'

export const OutcomeSolutions: CollectionConfig = {
  slug: 'outcome-solutions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'headline'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'headline', type: 'text' },
    { name: 'headlineAccent', type: 'text' },
    { name: 'description', type: 'textarea' },
    ctaField('ctaPrimary', 'Primary CTA'),
    ctaField('ctaSecondary', 'Secondary CTA'),
    {
      name: 'stats',
      type: 'array',
      labels: { singular: 'Stat', plural: 'Stats' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'pillars',
      type: 'array',
      label: 'Pillars/Approaches',
      labels: { singular: 'Pillar', plural: 'Pillars' },
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
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    ctaSectionField('ctaSection', 'CTA Section'),
    {
      name: 'body',
      type: 'richText',
      label: 'Additional Content',
    },
  ],
}
