import type { GlobalConfig } from 'payload'
import { ctaSectionField } from '../fields/cta'

export const CompanyOverview: GlobalConfig = {
  slug: 'company-overview',
  label: 'Company Overview',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        { name: 'headlineAccent', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'facts',
      type: 'array',
      labels: { singular: 'Fact', plural: 'Facts' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'story',
      type: 'group',
      label: 'Story Section',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        {
          name: 'paragraphs',
          type: 'array',
          labels: { singular: 'Paragraph', plural: 'Paragraphs' },
          fields: [
            { name: 'text', type: 'textarea', required: true },
          ],
        },
        { name: 'linkText', type: 'text' },
        { name: 'linkHref', type: 'text' },
        {
          name: 'quote',
          type: 'group',
          fields: [
            { name: 'text', type: 'textarea' },
            { name: 'name', type: 'text' },
            { name: 'role', type: 'text' },
            { name: 'initials', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'navCards',
      type: 'array',
      labels: { singular: 'Card', plural: 'Cards' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'offices',
      type: 'array',
      labels: { singular: 'Office', plural: 'Offices' },
      fields: [
        { name: 'city', type: 'text', required: true },
        { name: 'role', type: 'text' },
      ],
    },
    ctaSectionField(),
  ],
}
