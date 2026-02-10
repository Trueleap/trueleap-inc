import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'siteName', type: 'text' },
    { name: 'siteDescription', type: 'textarea' },
    {
      name: 'contactEmails',
      type: 'group',
      fields: [
        { name: 'general', type: 'text' },
        { name: 'sales', type: 'text' },
        { name: 'press', type: 'text' },
        { name: 'security', type: 'text' },
        { name: 'careers', type: 'text' },
        { name: 'education', type: 'text' },
        { name: 'government', type: 'text' },
        { name: 'partners', type: 'text' },
        { name: 'privacy', type: 'text' },
        { name: 'legal', type: 'text' },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    { name: 'footerQuote', type: 'textarea' },
    { name: 'copyright', type: 'text' },
  ],
}
