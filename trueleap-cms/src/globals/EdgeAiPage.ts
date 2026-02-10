import type { GlobalConfig } from 'payload'
import { ctaSectionField } from '../fields/cta'
import { heroWithCtaField } from '../fields/hero'

export const EdgeAiPage: GlobalConfig = {
  slug: 'edge-ai-page',
  label: 'Edge AI Page',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    heroWithCtaField(),
    {
      name: 'capabilities',
      type: 'array',
      labels: { singular: 'Capability', plural: 'Capabilities' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'useCases',
      type: 'array',
      labels: { singular: 'Use Case', plural: 'Use Cases' },
      fields: [
        { name: 'category', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'specs',
      type: 'array',
      labels: { singular: 'Spec', plural: 'Specs' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'howItWorks',
      type: 'array',
      label: 'How It Works Steps',
      labels: { singular: 'Step', plural: 'Steps' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'privacyFeatures',
      type: 'array',
      labels: { singular: 'Feature', plural: 'Features' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    ctaSectionField(),
  ],
}
