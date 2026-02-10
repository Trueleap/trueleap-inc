import type { GlobalConfig } from 'payload'
import { ctaSectionField } from '../fields/cta'
import { heroField } from '../fields/hero'

export const SolutionsOverview: GlobalConfig = {
  slug: 'solutions-overview',
  label: 'Solutions Overview',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    heroField(),
    {
      name: 'industryCards',
      type: 'array',
      labels: { singular: 'Card', plural: 'Cards' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'href', type: 'text' },
        {
          name: 'features',
          type: 'array',
          labels: { singular: 'Feature', plural: 'Features' },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'outcomeCards',
      type: 'array',
      labels: { singular: 'Card', plural: 'Cards' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'href', type: 'text' },
      ],
    },
    ctaSectionField(),
  ],
}
