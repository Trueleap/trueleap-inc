import type { GlobalConfig } from 'payload'
import { ctaSectionField } from '../fields/cta'
import { heroField } from '../fields/hero'

export const StackPage: GlobalConfig = {
  slug: 'stack-page',
  label: 'Stack Page',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    heroField(),
    {
      name: 'quickStats',
      type: 'array',
      labels: { singular: 'Stat', plural: 'Stats' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'layers',
      type: 'array',
      labels: { singular: 'Layer', plural: 'Layers' },
      fields: [
        { name: 'number', type: 'text' },
        { name: 'name', type: 'text', required: true },
        { name: 'tagline', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'products',
          type: 'array',
          labels: { singular: 'Product', plural: 'Products' },
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'desc', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'designPrinciples',
      type: 'array',
      labels: { singular: 'Principle', plural: 'Principles' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'layerIntegration',
      type: 'array',
      label: 'Layer Integration Steps',
      labels: { singular: 'Step', plural: 'Steps' },
      fields: [
        { name: 'step', type: 'number' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },
    ctaSectionField(),
  ],
}
