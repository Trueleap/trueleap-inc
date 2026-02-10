import type { CollectionConfig } from 'payload'
import { ctaField, ctaSectionField } from '../fields/cta'

export const IndustrySolutions: CollectionConfig = {
  slug: 'industry-solutions',
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
      name: 'benefits',
      type: 'array',
      label: 'Benefits/Stats',
      labels: { singular: 'Benefit', plural: 'Benefits' },
      fields: [
        { name: 'metric', type: 'text' },
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'text' },
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
    {
      name: 'caseStudy',
      type: 'group',
      label: 'Case Study',
      fields: [
        { name: 'country', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'results',
          type: 'array',
          labels: { singular: 'Result', plural: 'Results' },
          fields: [
            { name: 'metric', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'whyCards',
      type: 'array',
      label: 'Why TrueLeap Cards',
      labels: { singular: 'Card', plural: 'Cards' },
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
