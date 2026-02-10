import type { GlobalConfig } from 'payload'
import { ctaSectionField } from '../fields/cta'
import { heroField } from '../fields/hero'

export const DocsPage: GlobalConfig = {
  slug: 'docs-page',
  label: 'Documentation Page',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    heroField(),
    {
      name: 'docCategories',
      type: 'array',
      labels: { singular: 'Category', plural: 'Categories' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Item', plural: 'Items' },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'sdks',
      type: 'array',
      labels: { singular: 'SDK', plural: 'SDKs' },
      fields: [
        { name: 'language', type: 'text', required: true },
        { name: 'installCommand', type: 'text' },
        { name: 'badge', type: 'text', admin: { description: 'Badge/Version' } },
      ],
    },
    {
      name: 'supportChannels',
      type: 'array',
      labels: { singular: 'Channel', plural: 'Channels' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    ctaSectionField(),
  ],
}
