import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tier', 'type', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'url', type: 'text' },
    {
      name: 'tier',
      type: 'select',
      defaultValue: 'strategic',
      options: [
        { label: 'Strategic', value: 'strategic' },
        { label: 'Technology', value: 'technology' },
        { label: 'Implementation', value: 'implementation' },
        { label: 'Institutional', value: 'institutional' },
      ],
    },
    { name: 'type', type: 'text', admin: { description: 'Type/Category' } },
    { name: 'description', type: 'textarea' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
