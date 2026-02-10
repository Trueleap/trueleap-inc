import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'headerGroups',
      type: 'array',
      label: 'Header Nav Groups',
      labels: { singular: 'Group', plural: 'Groups' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text' },
        {
          name: 'children',
          type: 'array',
          labels: { singular: 'Child', plural: 'Children' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'headerCta',
      type: 'group',
      fields: [
        { name: 'secondaryText', type: 'text' },
        { name: 'secondaryHref', type: 'text' },
        { name: 'primaryText', type: 'text' },
        { name: 'primaryHref', type: 'text' },
      ],
    },
    {
      name: 'footerGroups',
      type: 'array',
      label: 'Footer Link Groups',
      labels: { singular: 'Group', plural: 'Groups' },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          labels: { singular: 'Link', plural: 'Links' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
            { name: 'external', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
  ],
}
