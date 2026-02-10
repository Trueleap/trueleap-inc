import type { GlobalConfig } from 'payload'
import { ctaField, ctaSectionWithEmailField } from '../fields/cta'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
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
        { name: 'line1', type: 'text', label: 'Headline Line 1' },
        { name: 'line2', type: 'text', label: 'Headline Line 2' },
        { name: 'subheadline', type: 'textarea' },
        ctaField('ctaPrimary', 'Primary CTA'),
        ctaField('ctaSecondary', 'Secondary CTA'),
        {
          name: 'stats',
          type: 'array',
          labels: { singular: 'Stat', plural: 'Stats' },
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
          ],
        },
        { name: 'partnerLogosTitle', type: 'text' },
      ],
    },
    {
      name: 'mission',
      type: 'group',
      label: 'Mission Section',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        { name: 'headlineAccent', type: 'text' },
        { name: 'paragraph1', type: 'textarea' },
        { name: 'paragraph2', type: 'textarea' },
        { name: 'linkText', type: 'text' },
        { name: 'linkHref', type: 'text' },
      ],
    },
    {
      name: 'platform',
      type: 'group',
      label: 'Platform Section',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'capabilities',
          type: 'array',
          labels: { singular: 'Capability', plural: 'Capabilities' },
          fields: [
            { name: 'label', type: 'text' },
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            { name: 'href', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'products',
      type: 'group',
      label: 'Products Section',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Product', plural: 'Products' },
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'tagline', type: 'text' },
            { name: 'description', type: 'textarea' },
            {
              name: 'wireframe',
              type: 'select',
              defaultValue: 'dashboard',
              options: [
                { label: 'Dashboard', value: 'dashboard' },
                { label: 'Mobile', value: 'mobile' },
                { label: 'Photo', value: 'photo' },
                { label: 'Hardware', value: 'hardware' },
                { label: 'Logo', value: 'logo' },
                { label: 'Chart', value: 'chart' },
                { label: 'Map', value: 'map' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'solutions',
      type: 'group',
      label: 'Solutions Section',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        { name: 'linkText', type: 'text' },
        { name: 'linkHref', type: 'text' },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Solution', plural: 'Solutions' },
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'href', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'caseStudies',
      type: 'group',
      label: 'Case Studies Section',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Case Study', plural: 'Case Studies' },
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'metric', type: 'text' },
            { name: 'metricLabel', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'tag', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'impact',
      type: 'group',
      label: 'Impact Section',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        { name: 'headlineAccent', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'ctaText', type: 'text' },
        { name: 'ctaHref', type: 'text' },
        {
          name: 'metrics',
          type: 'array',
          labels: { singular: 'Metric', plural: 'Metrics' },
          fields: [
            { name: 'value', type: 'number' },
            { name: 'suffix', type: 'text' },
            { name: 'prefix', type: 'text' },
            { name: 'label', type: 'text', required: true },
            {
              name: 'format',
              type: 'select',
              defaultValue: 'number',
              options: [
                { label: 'Number', value: 'number' },
                { label: 'Compact', value: 'compact' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'testimonials',
      type: 'group',
      label: 'Testimonials Section',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
      ],
    },
    ctaSectionWithEmailField('cta', 'Bottom CTA'),
  ],
}
