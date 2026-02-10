import type { CollectionConfig } from 'payload'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'industry', 'featured', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'client', type: 'text' },
    { name: 'category', type: 'text' },
    {
      name: 'industry',
      type: 'select',
      defaultValue: 'governments',
      options: [
        { label: 'Governments', value: 'governments' },
        { label: 'Education', value: 'education' },
        { label: 'NGOs', value: 'ngos' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
    },
    { name: 'region', type: 'text' },
    { name: 'country', type: 'text' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'publishedAt', type: 'date' },
    {
      name: 'metrics',
      type: 'array',
      labels: { singular: 'Metric', plural: 'Metrics' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'quote',
      type: 'group',
      fields: [
        { name: 'text', type: 'textarea' },
        { name: 'attribution', type: 'text' },
        { name: 'role', type: 'text' },
      ],
    },
    {
      name: 'body',
      type: 'richText',
    },
  ],
}
