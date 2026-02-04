import { defineConfig } from 'tinacms';

// Tina CMS configuration
// This sets up the schema for content editing
// To use: npm install tinacms @tinacms/cli && npx tinacms dev

export default defineConfig({
  branch: process.env.TINA_BRANCH || 'main',
  clientId: process.env.TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'caseStudy',
        label: 'Case Studies',
        path: 'src/content/case-studies',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'client',
            label: 'Client Name',
          },
          {
            type: 'string',
            name: 'industry',
            label: 'Industry',
            options: ['governments', 'education', 'ngos', 'enterprise'],
          },
          {
            type: 'string',
            name: 'region',
            label: 'Region',
          },
          {
            type: 'image',
            name: 'image',
            label: 'Featured Image',
          },
          {
            type: 'boolean',
            name: 'featured',
            label: 'Featured',
          },
          {
            type: 'datetime',
            name: 'publishedAt',
            label: 'Published Date',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Content',
            isBody: true,
          },
        ],
      },
      {
        name: 'news',
        label: 'News & Press',
        path: 'src/content/news',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'author',
            label: 'Author',
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
            options: ['press', 'update', 'thought-leadership'],
          },
          {
            type: 'image',
            name: 'image',
            label: 'Featured Image',
          },
          {
            type: 'datetime',
            name: 'publishedAt',
            label: 'Published Date',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Content',
            isBody: true,
          },
        ],
      },
      {
        name: 'team',
        label: 'Team Members',
        path: 'src/content/team',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'name',
            label: 'Name',
            required: true,
          },
          {
            type: 'string',
            name: 'role',
            label: 'Role',
          },
          {
            type: 'string',
            name: 'bio',
            label: 'Bio',
            ui: { component: 'textarea' },
          },
          {
            type: 'image',
            name: 'image',
            label: 'Photo',
          },
          {
            type: 'string',
            name: 'linkedin',
            label: 'LinkedIn URL',
          },
          {
            type: 'number',
            name: 'order',
            label: 'Display Order',
          },
        ],
      },
    ],
  },
});
