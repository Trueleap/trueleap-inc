import type { GlobalConfig } from 'payload'
import { ctaSectionField } from '../fields/cta'

export const MissionPage: GlobalConfig = {
  slug: 'mission-page',
  label: 'Mission & Vision',
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
      name: 'mission',
      type: 'group',
      label: 'Mission Card',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'vision',
      type: 'group',
      label: 'Vision Card',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    { name: 'manifestoQuote', type: 'textarea' },
    {
      name: 'values',
      type: 'array',
      labels: { singular: 'Value', plural: 'Values' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'icon', type: 'text', admin: { description: 'Icon Key' } },
      ],
    },
    {
      name: 'milestones',
      type: 'array',
      labels: { singular: 'Milestone', plural: 'Milestones' },
      fields: [
        { name: 'year', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'teamPreview',
      type: 'array',
      labels: { singular: 'Member', plural: 'Members' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'bio', type: 'text' },
      ],
    },
    ctaSectionField(),
  ],
}
