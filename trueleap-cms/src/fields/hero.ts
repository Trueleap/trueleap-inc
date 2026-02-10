import type { GroupField } from 'payload'
import { ctaField } from './cta'

/** Standard hero: eyebrow, headline, headlineAccent, description */
export const heroField = (label = 'Hero'): GroupField => ({
  name: 'hero',
  type: 'group',
  label,
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'headline', type: 'text' },
    { name: 'headlineAccent', type: 'text' },
    { name: 'description', type: 'textarea' },
  ],
})

/** Hero with CTAs: adds primary + secondary CTA to standard hero */
export const heroWithCtaField = (label = 'Hero'): GroupField => ({
  name: 'hero',
  type: 'group',
  label,
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'headline', type: 'text' },
    { name: 'headlineAccent', type: 'text' },
    { name: 'description', type: 'textarea' },
    ctaField('ctaPrimary', 'Primary CTA'),
    ctaField('ctaSecondary', 'Secondary CTA'),
  ],
})
