import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Not supported on Workers due to lack of sharp
    crop: false,
    focalPoint: false,
    mimeTypes: ['image/*', 'application/pdf'],
  },
}
