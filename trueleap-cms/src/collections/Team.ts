import type { CollectionConfig } from 'payload'

export const Team: CollectionConfig = {
  slug: 'team',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'category', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'title', type: 'text' },
    { name: 'bio', type: 'textarea' },
    { name: 'initials', type: 'text' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'linkedin', type: 'text' },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'executive',
      options: [
        { label: 'Executive', value: 'executive' },
        { label: 'Advisory', value: 'advisory' },
      ],
    },
    { name: 'affiliation', type: 'text', admin: { description: 'For advisors' } },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
