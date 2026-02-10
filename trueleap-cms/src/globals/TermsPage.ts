import type { GlobalConfig } from 'payload'

export const TermsPage: GlobalConfig = {
  slug: 'terms-page',
  label: 'Terms of Service',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'lastUpdated', type: 'text' },
    {
      name: 'body',
      type: 'richText',
      label: 'Content',
    },
  ],
}
