import type { GlobalConfig } from 'payload'
import { heroField } from '../fields/hero'

export const LastMilePage: GlobalConfig = {
  slug: 'last-mile-page',
  label: 'Last Mile Page',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    heroField(),
    {
      name: 'stats',
      type: 'array',
      labels: { singular: 'Stat', plural: 'Stats' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'topicFilters',
      type: 'array',
      labels: { singular: 'Topic', plural: 'Topics' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'aboutSection',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
