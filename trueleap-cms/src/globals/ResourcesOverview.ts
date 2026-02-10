import type { GlobalConfig } from 'payload'
import { heroField } from '../fields/hero'

export const ResourcesOverview: GlobalConfig = {
  slug: 'resources-overview',
  label: 'Resources Overview',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    heroField(),
    {
      name: 'resourceSections',
      type: 'array',
      labels: { singular: 'Section', plural: 'Sections' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'href', type: 'text' },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Item', plural: 'Items' },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'quickLinks',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
