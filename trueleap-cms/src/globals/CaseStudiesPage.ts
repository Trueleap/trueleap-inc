import type { GlobalConfig } from 'payload'
import { heroField } from '../fields/hero'

export const CaseStudiesPage: GlobalConfig = {
  slug: 'case-studies-page',
  label: 'Case Studies Page',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    heroField(),
    {
      name: 'categoryFilters',
      type: 'array',
      labels: { singular: 'Category', plural: 'Categories' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'featuredTitle', type: 'text', label: 'Featured Section Title' },
    { name: 'allTitle', type: 'text', label: 'All Studies Section Title' },
  ],
}
