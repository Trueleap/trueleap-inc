import type { GlobalConfig } from 'payload'
import { simpleCtaSectionField } from '../fields/cta'
import { heroField } from '../fields/hero'

export const NewsroomPage: GlobalConfig = {
  slug: 'newsroom-page',
  label: 'Newsroom Page',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    heroField(),
    {
      name: 'mediaContact',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'role', type: 'text' },
        { name: 'email', type: 'text' },
      ],
    },
    {
      name: 'pressKitItems',
      type: 'array',
      labels: { singular: 'Item', plural: 'Items' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },
    simpleCtaSectionField(),
  ],
}
