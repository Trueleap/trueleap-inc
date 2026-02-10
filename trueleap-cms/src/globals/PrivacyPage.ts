import type { GlobalConfig } from 'payload'

export const PrivacyPage: GlobalConfig = {
  slug: 'privacy-page',
  label: 'Privacy Policy',
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
