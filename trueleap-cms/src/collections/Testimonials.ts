import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'attribution',
    defaultColumns: ['attribution', 'role', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'attribution', type: 'text', required: true },
    { name: 'role', type: 'text' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
