import type { ArrayField } from 'payload'

/** Array of { value, label } stat items */
export const statsArrayField = (
  name = 'stats',
  label = 'Stats',
): ArrayField => ({
  name,
  type: 'array',
  label,
  labels: { singular: 'Stat', plural: 'Stats' },
  admin: { components: {} },
  fields: [
    { name: 'value', type: 'text', required: true },
    { name: 'label', type: 'text', required: true },
  ],
})

/** Array of { value, label, description } stat items */
export const statsWithDescArrayField = (
  name = 'stats',
  label = 'Stats',
): ArrayField => ({
  name,
  type: 'array',
  label,
  labels: { singular: 'Stat', plural: 'Stats' },
  admin: { components: {} },
  fields: [
    { name: 'value', type: 'text', required: true },
    { name: 'label', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
  ],
})
