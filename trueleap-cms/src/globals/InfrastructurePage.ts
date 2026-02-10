import type { GlobalConfig } from 'payload'
import { ctaSectionField } from '../fields/cta'
import { heroWithCtaField } from '../fields/hero'

export const InfrastructurePage: GlobalConfig = {
  slug: 'infrastructure-page',
  label: 'Infrastructure Page',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    heroWithCtaField(),
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
      name: 'nodes',
      type: 'array',
      label: 'Hardware Nodes',
      labels: { singular: 'Node', plural: 'Nodes' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'tagline', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'specs',
          type: 'array',
          labels: { singular: 'Spec', plural: 'Specs' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      labels: { singular: 'Feature', plural: 'Features' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'deploymentModels',
      type: 'array',
      labels: { singular: 'Model', plural: 'Models' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'ideal', type: 'text', admin: { description: 'Ideal For' } },
      ],
    },
    ctaSectionField(),
  ],
}
