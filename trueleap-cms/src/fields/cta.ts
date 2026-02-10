import type { Field, GroupField } from 'payload'

/** A CTA link with text + href */
export const ctaField = (name: string, label: string): GroupField => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'text', type: 'text' },
    { name: 'href', type: 'text' },
  ],
})

/** A CTA section with headline, description, primary + secondary CTAs */
export const ctaSectionField = (
  name = 'cta',
  label = 'CTA Section',
): GroupField => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'headline', type: 'text' },
    { name: 'description', type: 'textarea' },
    ctaField('primaryCta', 'Primary CTA'),
    ctaField('secondaryCta', 'Secondary CTA'),
  ],
})

/** CTA section with single CTA + email (used by homepage) */
export const ctaSectionWithEmailField = (
  name = 'cta',
  label = 'Bottom CTA',
): GroupField => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'headline', type: 'text' },
    { name: 'description', type: 'textarea' },
    ctaField('primaryCta', 'Primary CTA'),
    ctaField('secondaryCta', 'Secondary CTA'),
    { name: 'contactEmail', type: 'text' },
  ],
})

/** Simple CTA section with ctaText + ctaHref (used by careers, newsroom) */
export const simpleCtaSectionField = (
  name = 'cta',
  label = 'CTA Section',
): GroupField => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'headline', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'ctaText', type: 'text' },
    { name: 'ctaHref', type: 'text' },
  ],
})

/** CTA section with only primary CTA (used by trust-center) */
export const ctaSectionPrimaryOnlyField = (
  name = 'cta',
  label = 'CTA Section',
): GroupField => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'headline', type: 'text' },
    { name: 'description', type: 'textarea' },
    ctaField('primaryCta', 'Primary CTA'),
  ],
})
