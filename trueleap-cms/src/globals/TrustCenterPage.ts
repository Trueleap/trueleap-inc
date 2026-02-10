import type { GlobalConfig } from 'payload'
import { ctaSectionPrimaryOnlyField } from '../fields/cta'
import { heroField } from '../fields/hero'

export const TrustCenterPage: GlobalConfig = {
  slug: 'trust-center-page',
  label: 'Trust Center Page',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    heroField(),
    {
      name: 'securityItems',
      type: 'array',
      labels: { singular: 'Item', plural: 'Items' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'complianceItems',
      type: 'array',
      labels: { singular: 'Item', plural: 'Items' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'certifications',
      type: 'array',
      labels: { singular: 'Certification', plural: 'Certifications' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'documents',
      type: 'array',
      labels: { singular: 'Document', plural: 'Documents' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'access', type: 'text', admin: { description: 'Access Level' } },
      ],
    },
    {
      name: 'incidentResponse',
      type: 'group',
      fields: [
        { name: 'responseTime', type: 'text' },
        { name: 'monitoring', type: 'text' },
        { name: 'notification', type: 'text' },
      ],
    },
    ctaSectionPrimaryOnlyField(),
  ],
}
