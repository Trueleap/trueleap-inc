import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', 'featured', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'author', type: 'text' },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'press',
      options: [
        { label: 'Press', value: 'press' },
        { label: 'Update', value: 'update' },
        { label: 'Thought Leadership', value: 'thought-leadership' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'publishedAt', type: 'date' },
    {
      name: 'body',
      type: 'richText',
    },
  ],
}
