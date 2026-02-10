import type { CollectionConfig } from 'payload'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'department', 'location', 'type', 'active'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'department',
      type: 'select',
      defaultValue: 'Engineering',
      options: [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Product', value: 'Product' },
        { label: 'Operations', value: 'Operations' },
        { label: 'Sales & Partnerships', value: 'Sales & Partnerships' },
        { label: 'People & Finance', value: 'People & Finance' },
      ],
    },
    { name: 'location', type: 'text' },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'Full-time',
      options: [
        { label: 'Full-time', value: 'Full-time' },
        { label: 'Part-time', value: 'Part-time' },
        { label: 'Contract', value: 'Contract' },
      ],
    },
    { name: 'summary', type: 'textarea', admin: { description: 'Summary for card listing' } },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'order', type: 'number', defaultValue: 0 },
    {
      name: 'sourcePdf',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Upload Job Description PDF' },
    },
    {
      name: 'body',
      type: 'richText',
    },
  ],
}
