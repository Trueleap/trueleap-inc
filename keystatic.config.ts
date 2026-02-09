import { config, fields, collection, singleton } from '@keystatic/core';

// Reusable field helpers
const ctaField = (label: string) =>
  fields.object({
    text: fields.text({ label: `${label} Text` }),
    href: fields.text({ label: `${label} URL` }),
  }, { label });

const statField = (label: string) =>
  fields.object({
    value: fields.text({ label: 'Value' }),
    label: fields.text({ label: 'Label' }),
  }, { label });

const statWithDetailField = (label: string) =>
  fields.object({
    value: fields.text({ label: 'Value' }),
    label: fields.text({ label: 'Label' }),
    description: fields.text({ label: 'Description' }),
  }, { label });

const isProd = import.meta.env.PROD;

export default config({
  storage: isProd
    ? {
        kind: 'github',
        repo: 'Trueleap/trueleap-inc',
        branchPrefix: 'content/',
      }
    : { kind: 'local' },
  collections: {
    // ─── CASE STUDIES ───
    'case-studies': collection({
      label: 'Case Studies',
      slugField: 'title',
      path: 'src/content/case-studies/*/',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        subtitle: fields.text({ label: 'Subtitle' }),
        description: fields.text({ label: 'Description', multiline: true }),
        client: fields.text({ label: 'Client' }),
        category: fields.text({ label: 'Category' }),
        industry: fields.select({
          label: 'Industry',
          options: [
            { label: 'Governments', value: 'governments' },
            { label: 'Education', value: 'education' },
            { label: 'NGOs', value: 'ngos' },
            { label: 'Enterprise', value: 'enterprise' },
          ],
          defaultValue: 'governments',
        }),
        region: fields.text({ label: 'Region' }),
        country: fields.text({ label: 'Country' }),
        image: fields.image({
          label: 'Featured Image',
          directory: 'public/images/case-studies',
          publicPath: '/images/case-studies/',
        }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
        publishedAt: fields.datetime({ label: 'Published Date' }),
        metrics: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            value: fields.text({ label: 'Value' }),
          }),
          { label: 'Metrics', itemLabel: (props) => props.fields.label.value }
        ),
        quote: fields.object({
          text: fields.text({ label: 'Quote Text', multiline: true }),
          attribution: fields.text({ label: 'Attribution' }),
          role: fields.text({ label: 'Role' }),
        }, { label: 'Quote' }),
        body: fields.mdx({ label: 'Content' }),
      },
    }),

    // ─── NEWS ───
    news: collection({
      label: 'News & Press',
      slugField: 'title',
      path: 'src/content/news/*/',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        author: fields.text({ label: 'Author' }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Press', value: 'press' },
            { label: 'Update', value: 'update' },
            { label: 'Thought Leadership', value: 'thought-leadership' },
          ],
          defaultValue: 'press',
        }),
        image: fields.image({
          label: 'Featured Image',
          directory: 'public/images/news',
          publicPath: '/images/news/',
        }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
        publishedAt: fields.datetime({ label: 'Published Date' }),
        body: fields.mdx({ label: 'Content' }),
      },
    }),

    // ─── TEAM ───
    team: collection({
      label: 'Team Members',
      slugField: 'name',
      path: 'src/content/team/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        title: fields.text({ label: 'Title' }),
        bio: fields.text({ label: 'Bio', multiline: true }),
        initials: fields.text({ label: 'Initials' }),
        image: fields.image({
          label: 'Photo',
          directory: 'public/images/team',
          publicPath: '/images/team/',
        }),
        linkedin: fields.text({ label: 'LinkedIn URL' }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Executive', value: 'executive' },
            { label: 'Advisory', value: 'advisory' },
          ],
          defaultValue: 'executive',
        }),
        affiliation: fields.text({ label: 'Affiliation (for advisors)' }),
        order: fields.number({ label: 'Display Order', defaultValue: 0 }),
      },
    }),

    // ─── PARTNERS ───
    partners: collection({
      label: 'Partners',
      slugField: 'name',
      path: 'src/content/partners/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        logo: fields.image({
          label: 'Logo',
          directory: 'public/images/partners',
          publicPath: '/images/partners/',
        }),
        url: fields.text({ label: 'Website URL' }),
        tier: fields.select({
          label: 'Tier',
          options: [
            { label: 'Strategic', value: 'strategic' },
            { label: 'Technology', value: 'technology' },
            { label: 'Implementation', value: 'implementation' },
            { label: 'Institutional', value: 'institutional' },
          ],
          defaultValue: 'strategic',
        }),
        type: fields.text({ label: 'Type/Category' }),
        description: fields.text({ label: 'Description', multiline: true }),
        order: fields.number({ label: 'Display Order', defaultValue: 0 }),
      },
    }),

    // ─── JOBS ───
    jobs: collection({
      label: 'Job Openings',
      slugField: 'title',
      path: 'src/content/jobs/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        department: fields.select({
          label: 'Department',
          options: [
            { label: 'Engineering', value: 'Engineering' },
            { label: 'Product', value: 'Product' },
            { label: 'Operations', value: 'Operations' },
            { label: 'Sales & Partnerships', value: 'Sales & Partnerships' },
            { label: 'People & Finance', value: 'People & Finance' },
          ],
          defaultValue: 'Engineering',
        }),
        location: fields.text({ label: 'Location' }),
        type: fields.select({
          label: 'Type',
          options: [
            { label: 'Full-time', value: 'Full-time' },
            { label: 'Part-time', value: 'Part-time' },
            { label: 'Contract', value: 'Contract' },
          ],
          defaultValue: 'Full-time',
        }),
        description: fields.text({ label: 'Description', multiline: true }),
        active: fields.checkbox({ label: 'Active', defaultValue: true }),
        order: fields.number({ label: 'Display Order', defaultValue: 0 }),
      },
    }),

    // ─── TESTIMONIALS ───
    testimonials: collection({
      label: 'Testimonials',
      slugField: 'attribution',
      path: 'src/content/testimonials/*',
      format: { data: 'json' },
      schema: {
        quote: fields.text({ label: 'Quote', multiline: true }),
        attribution: fields.slug({ name: { label: 'Attribution' } }),
        role: fields.text({ label: 'Role' }),
        order: fields.number({ label: 'Display Order', defaultValue: 0 }),
      },
    }),

    // ─── INDUSTRY SOLUTIONS ───
    'industry-solutions': collection({
      label: 'Industry Solutions',
      slugField: 'title',
      path: 'src/content/industry-solutions/*/',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        headline: fields.text({ label: 'Headline' }),
        headlineAccent: fields.text({ label: 'Headline Accent Word' }),
        description: fields.text({ label: 'Description', multiline: true }),
        ctaPrimary: fields.object({
          text: fields.text({ label: 'Text' }),
          href: fields.text({ label: 'URL' }),
        }, { label: 'Primary CTA' }),
        ctaSecondary: fields.object({
          text: fields.text({ label: 'Text' }),
          href: fields.text({ label: 'URL' }),
        }, { label: 'Secondary CTA' }),
        benefits: fields.array(
          fields.object({
            metric: fields.text({ label: 'Metric' }),
            label: fields.text({ label: 'Label' }),
            description: fields.text({ label: 'Description' }),
          }),
          { label: 'Benefits/Stats', itemLabel: (props) => props.fields.label.value }
        ),
        useCases: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Use Cases', itemLabel: (props) => props.fields.title.value }
        ),
        caseStudy: fields.object({
          country: fields.text({ label: 'Country' }),
          title: fields.text({ label: 'Title' }),
          description: fields.text({ label: 'Description', multiline: true }),
          results: fields.array(
            fields.object({
              metric: fields.text({ label: 'Metric' }),
              label: fields.text({ label: 'Label' }),
            }),
            { label: 'Results', itemLabel: (props) => props.fields.label.value }
          ),
        }, { label: 'Case Study' }),
        whyCards: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Why TrueLeap Cards', itemLabel: (props) => props.fields.title.value }
        ),
        ctaSection: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({
            text: fields.text({ label: 'Text' }),
            href: fields.text({ label: 'URL' }),
          }, { label: 'Primary CTA' }),
          secondaryCta: fields.object({
            text: fields.text({ label: 'Text' }),
            href: fields.text({ label: 'URL' }),
          }, { label: 'Secondary CTA' }),
        }, { label: 'CTA Section' }),
        body: fields.mdx({ label: 'Additional Content' }),
      },
    }),

    // ─── OUTCOME SOLUTIONS ───
    'outcome-solutions': collection({
      label: 'Outcome Solutions',
      slugField: 'title',
      path: 'src/content/outcome-solutions/*/',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        headline: fields.text({ label: 'Headline' }),
        headlineAccent: fields.text({ label: 'Headline Accent Word' }),
        description: fields.text({ label: 'Description', multiline: true }),
        ctaPrimary: fields.object({
          text: fields.text({ label: 'Text' }),
          href: fields.text({ label: 'URL' }),
        }, { label: 'Primary CTA' }),
        ctaSecondary: fields.object({
          text: fields.text({ label: 'Text' }),
          href: fields.text({ label: 'URL' }),
        }, { label: 'Secondary CTA' }),
        stats: fields.array(
          fields.object({
            value: fields.text({ label: 'Value' }),
            label: fields.text({ label: 'Label' }),
            description: fields.text({ label: 'Description' }),
          }),
          { label: 'Stats', itemLabel: (props) => props.fields.label.value }
        ),
        pillars: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Pillars/Approaches', itemLabel: (props) => props.fields.title.value }
        ),
        useCases: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Use Cases', itemLabel: (props) => props.fields.title.value }
        ),
        ctaSection: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({
            text: fields.text({ label: 'Text' }),
            href: fields.text({ label: 'URL' }),
          }, { label: 'Primary CTA' }),
          secondaryCta: fields.object({
            text: fields.text({ label: 'Text' }),
            href: fields.text({ label: 'URL' }),
          }, { label: 'Secondary CTA' }),
        }, { label: 'CTA Section' }),
        body: fields.mdx({ label: 'Additional Content' }),
      },
    }),
  },

  singletons: {
    // ─── SITE SETTINGS ───
    'site-settings': singleton({
      label: 'Site Settings',
      path: 'src/content/singletons/site-settings',
      format: { data: 'json' },
      schema: {
        siteName: fields.text({ label: 'Site Name' }),
        siteDescription: fields.text({ label: 'Site Description', multiline: true }),
        contactEmails: fields.object({
          general: fields.text({ label: 'General' }),
          sales: fields.text({ label: 'Sales' }),
          press: fields.text({ label: 'Press' }),
          security: fields.text({ label: 'Security' }),
          careers: fields.text({ label: 'Careers' }),
          education: fields.text({ label: 'Education' }),
          government: fields.text({ label: 'Government' }),
          partners: fields.text({ label: 'Partners' }),
          privacy: fields.text({ label: 'Privacy' }),
          legal: fields.text({ label: 'Legal' }),
        }, { label: 'Contact Emails' }),
        socialLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'URL' }),
          }),
          { label: 'Social Links', itemLabel: (props) => props.fields.label.value }
        ),
        footerQuote: fields.text({ label: 'Footer Quote', multiline: true }),
        copyright: fields.text({ label: 'Copyright Text' }),
      },
    }),

    // ─── NAVIGATION ───
    navigation: singleton({
      label: 'Navigation',
      path: 'src/content/singletons/navigation',
      format: { data: 'json' },
      schema: {
        headerGroups: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'URL' }),
            children: fields.array(
              fields.object({
                label: fields.text({ label: 'Label' }),
                href: fields.text({ label: 'URL' }),
              }),
              { label: 'Children', itemLabel: (props) => props.fields.label.value }
            ),
          }),
          { label: 'Header Nav Groups', itemLabel: (props) => props.fields.label.value }
        ),
        headerCta: fields.object({
          secondaryText: fields.text({ label: 'Secondary Link Text' }),
          secondaryHref: fields.text({ label: 'Secondary Link URL' }),
          primaryText: fields.text({ label: 'Primary Button Text' }),
          primaryHref: fields.text({ label: 'Primary Button URL' }),
        }, { label: 'Header CTA' }),
        footerGroups: fields.array(
          fields.object({
            label: fields.text({ label: 'Group Label' }),
            links: fields.array(
              fields.object({
                label: fields.text({ label: 'Label' }),
                href: fields.text({ label: 'URL' }),
                external: fields.checkbox({ label: 'External Link', defaultValue: false }),
              }),
              { label: 'Links', itemLabel: (props) => props.fields.label.value }
            ),
          }),
          { label: 'Footer Link Groups', itemLabel: (props) => props.fields.label.value }
        ),
      },
    }),

    // ─── HOMEPAGE ───
    homepage: singleton({
      label: 'Homepage',
      path: 'src/content/singletons/homepage',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          line1: fields.text({ label: 'Headline Line 1' }),
          line2: fields.text({ label: 'Headline Line 2' }),
          subheadline: fields.text({ label: 'Subheadline', multiline: true }),
          ctaPrimary: fields.object({
            text: fields.text({ label: 'Text' }),
            href: fields.text({ label: 'URL' }),
          }, { label: 'Primary CTA' }),
          ctaSecondary: fields.object({
            text: fields.text({ label: 'Text' }),
            href: fields.text({ label: 'URL' }),
          }, { label: 'Secondary CTA' }),
          stats: fields.array(
            fields.object({
              value: fields.text({ label: 'Value' }),
              label: fields.text({ label: 'Label' }),
            }),
            { label: 'Stats', itemLabel: (props) => props.fields.label.value }
          ),
          partnerLogosTitle: fields.text({ label: 'Partner Logos Title' }),
        }, { label: 'Hero' }),
        mission: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          paragraph1: fields.text({ label: 'Paragraph 1', multiline: true }),
          paragraph2: fields.text({ label: 'Paragraph 2', multiline: true }),
          linkText: fields.text({ label: 'Link Text' }),
          linkHref: fields.text({ label: 'Link URL' }),
        }, { label: 'Mission Section' }),
        platform: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          capabilities: fields.array(
            fields.object({
              label: fields.text({ label: 'Label' }),
              title: fields.text({ label: 'Title' }),
              description: fields.text({ label: 'Description', multiline: true }),
              href: fields.text({ label: 'URL' }),
            }),
            { label: 'Capabilities', itemLabel: (props) => props.fields.title.value }
          ),
        }, { label: 'Platform Section' }),
        products: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          items: fields.array(
            fields.object({
              name: fields.text({ label: 'Name' }),
              tagline: fields.text({ label: 'Tagline' }),
              description: fields.text({ label: 'Description', multiline: true }),
              wireframe: fields.select({
                label: 'Wireframe Type',
                options: [
                  { label: 'Dashboard', value: 'dashboard' },
                  { label: 'Mobile', value: 'mobile' },
                ],
                defaultValue: 'dashboard',
              }),
            }),
            { label: 'Products', itemLabel: (props) => props.fields.name.value }
          ),
        }, { label: 'Products Section' }),
        solutions: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          linkText: fields.text({ label: 'Link Text' }),
          linkHref: fields.text({ label: 'Link URL' }),
          items: fields.array(
            fields.object({
              title: fields.text({ label: 'Title' }),
              href: fields.text({ label: 'URL' }),
            }),
            { label: 'Solutions', itemLabel: (props) => props.fields.title.value }
          ),
        }, { label: 'Solutions Section' }),
        caseStudies: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          items: fields.array(
            fields.object({
              title: fields.text({ label: 'Title' }),
              metric: fields.text({ label: 'Metric' }),
              metricLabel: fields.text({ label: 'Metric Label' }),
              description: fields.text({ label: 'Description', multiline: true }),
              tag: fields.text({ label: 'Tag' }),
            }),
            { label: 'Case Studies', itemLabel: (props) => props.fields.title.value }
          ),
        }, { label: 'Case Studies Section' }),
        impact: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
          ctaText: fields.text({ label: 'CTA Text' }),
          ctaHref: fields.text({ label: 'CTA URL' }),
          metrics: fields.array(
            fields.object({
              value: fields.number({ label: 'Value' }),
              suffix: fields.text({ label: 'Suffix' }),
              prefix: fields.text({ label: 'Prefix' }),
              label: fields.text({ label: 'Label' }),
              format: fields.select({
                label: 'Format',
                options: [
                  { label: 'Number', value: 'number' },
                  { label: 'Compact', value: 'compact' },
                ],
                defaultValue: 'number',
              }),
            }),
            { label: 'Metrics', itemLabel: (props) => props.fields.label.value }
          ),
        }, { label: 'Impact Section' }),
        testimonials: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
        }, { label: 'Testimonials Section' }),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({
            text: fields.text({ label: 'Text' }),
            href: fields.text({ label: 'URL' }),
          }, { label: 'Primary CTA' }),
          secondaryCta: fields.object({
            text: fields.text({ label: 'Text' }),
            href: fields.text({ label: 'URL' }),
          }, { label: 'Secondary CTA' }),
          contactEmail: fields.text({ label: 'Contact Email' }),
        }, { label: 'Bottom CTA' }),
      },
    }),

    // ─── COMPANY OVERVIEW ───
    'company-overview': singleton({
      label: 'Company Overview',
      path: 'src/content/singletons/company-overview',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Hero' }),
        facts: fields.array(
          fields.object({
            value: fields.text({ label: 'Value' }),
            label: fields.text({ label: 'Label' }),
          }),
          { label: 'Facts', itemLabel: (props) => props.fields.label.value }
        ),
        story: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          paragraphs: fields.array(
            fields.text({ label: 'Paragraph', multiline: true }),
            { label: 'Paragraphs' }
          ),
          linkText: fields.text({ label: 'Link Text' }),
          linkHref: fields.text({ label: 'Link URL' }),
          quote: fields.object({
            text: fields.text({ label: 'Quote', multiline: true }),
            name: fields.text({ label: 'Name' }),
            role: fields.text({ label: 'Role' }),
            initials: fields.text({ label: 'Initials' }),
          }, { label: 'Quote' }),
        }, { label: 'Story Section' }),
        navCards: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description' }),
            href: fields.text({ label: 'URL' }),
          }),
          { label: 'Nav Cards', itemLabel: (props) => props.fields.title.value }
        ),
        offices: fields.array(
          fields.object({
            city: fields.text({ label: 'City' }),
            role: fields.text({ label: 'Role' }),
          }),
          { label: 'Offices', itemLabel: (props) => props.fields.city.value }
        ),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({
            text: fields.text({ label: 'Text' }),
            href: fields.text({ label: 'URL' }),
          }, { label: 'Primary CTA' }),
          secondaryCta: fields.object({
            text: fields.text({ label: 'Text' }),
            href: fields.text({ label: 'URL' }),
          }, { label: 'Secondary CTA' }),
        }, { label: 'CTA' }),
      },
    }),

    // ─── MISSION PAGE ───
    'mission-page': singleton({
      label: 'Mission & Vision',
      path: 'src/content/singletons/mission-page',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Hero' }),
        mission: fields.object({
          title: fields.text({ label: 'Title' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Mission Card' }),
        vision: fields.object({
          title: fields.text({ label: 'Title' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Vision Card' }),
        manifestoQuote: fields.text({ label: 'Manifesto Quote', multiline: true }),
        values: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
            icon: fields.text({ label: 'Icon Key' }),
          }),
          { label: 'Values', itemLabel: (props) => props.fields.title.value }
        ),
        milestones: fields.array(
          fields.object({
            year: fields.text({ label: 'Year' }),
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Milestones', itemLabel: (props) => props.fields.title.value }
        ),
        teamPreview: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            role: fields.text({ label: 'Role' }),
            bio: fields.text({ label: 'Bio' }),
          }),
          { label: 'Team Preview', itemLabel: (props) => props.fields.name.value }
        ),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          secondaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'CTA' }),
      },
    }),

    // ─── CAREERS PAGE ───
    'careers-page': singleton({
      label: 'Careers Page',
      path: 'src/content/singletons/careers-page',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
          ctaPrimary: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          ctaSecondary: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'Hero' }),
        stats: fields.array(
          fields.object({ value: fields.text({ label: 'Value' }), label: fields.text({ label: 'Label' }) }),
          { label: 'Stats', itemLabel: (props) => props.fields.label.value }
        ),
        benefits: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Benefits', itemLabel: (props) => props.fields.title.value }
        ),
        hiringProcess: fields.array(
          fields.object({
            step: fields.text({ label: 'Step Number' }),
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description' }),
          }),
          { label: 'Hiring Process', itemLabel: (props) => props.fields.title.value }
        ),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          ctaText: fields.text({ label: 'CTA Text' }),
          ctaHref: fields.text({ label: 'CTA URL' }),
        }, { label: 'CTA' }),
      },
    }),

    // ─── PLATFORM OVERVIEW ───
    'platform-overview': singleton({
      label: 'Platform Overview',
      path: 'src/content/singletons/platform-overview',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
          ctaPrimary: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          ctaSecondary: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'Hero' }),
        platformAreas: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
            href: fields.text({ label: 'URL' }),
            features: fields.array(fields.text({ label: 'Feature' }), { label: 'Features' }),
            metric: fields.text({ label: 'Metric' }),
            metricLabel: fields.text({ label: 'Metric Label' }),
          }),
          { label: 'Platform Areas', itemLabel: (props) => props.fields.title.value }
        ),
        specs: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            value: fields.text({ label: 'Value' }),
            detail: fields.text({ label: 'Detail' }),
          }),
          { label: 'Specs', itemLabel: (props) => props.fields.label.value }
        ),
        architectureLayers: fields.array(
          fields.object({
            layer: fields.text({ label: 'Layer' }),
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description' }),
          }),
          { label: 'Architecture Layers', itemLabel: (props) => props.fields.title.value }
        ),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          secondaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'CTA' }),
      },
    }),

    // ─── INFRASTRUCTURE PAGE ───
    'infrastructure-page': singleton({
      label: 'Infrastructure Page',
      path: 'src/content/singletons/infrastructure-page',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
          ctaPrimary: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          ctaSecondary: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'Hero' }),
        stats: fields.array(
          fields.object({ value: fields.text({ label: 'Value' }), label: fields.text({ label: 'Label' }) }),
          { label: 'Stats', itemLabel: (props) => props.fields.label.value }
        ),
        nodes: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            tagline: fields.text({ label: 'Tagline' }),
            description: fields.text({ label: 'Description', multiline: true }),
            specs: fields.array(
              fields.object({ label: fields.text({ label: 'Label' }), value: fields.text({ label: 'Value' }) }),
              { label: 'Specs', itemLabel: (props) => props.fields.label.value }
            ),
          }),
          { label: 'Hardware Nodes', itemLabel: (props) => props.fields.name.value }
        ),
        features: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Features', itemLabel: (props) => props.fields.title.value }
        ),
        deploymentModels: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            description: fields.text({ label: 'Description', multiline: true }),
            ideal: fields.text({ label: 'Ideal For' }),
          }),
          { label: 'Deployment Models', itemLabel: (props) => props.fields.name.value }
        ),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          secondaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'CTA' }),
      },
    }),

    // ─── DIGITAL SYSTEMS PAGE ───
    'digital-systems-page': singleton({
      label: 'Digital Systems Page',
      path: 'src/content/singletons/digital-systems-page',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
          ctaPrimary: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          ctaSecondary: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'Hero' }),
        systems: fields.array(
          fields.object({
            eyebrow: fields.text({ label: 'Eyebrow' }),
            name: fields.text({ label: 'Name' }),
            description: fields.text({ label: 'Description', multiline: true }),
            features: fields.array(fields.text({ label: 'Feature' }), { label: 'Features' }),
          }),
          { label: 'Systems', itemLabel: (props) => props.fields.name.value }
        ),
        integrationBenefits: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Integration Benefits', itemLabel: (props) => props.fields.title.value }
        ),
        useCases: fields.array(
          fields.object({
            category: fields.text({ label: 'Category' }),
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Use Cases', itemLabel: (props) => props.fields.title.value }
        ),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          secondaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'CTA' }),
      },
    }),

    // ─── EDGE AI PAGE ───
    'edge-ai-page': singleton({
      label: 'Edge AI Page',
      path: 'src/content/singletons/edge-ai-page',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
          ctaPrimary: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          ctaSecondary: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'Hero' }),
        capabilities: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Capabilities', itemLabel: (props) => props.fields.title.value }
        ),
        useCases: fields.array(
          fields.object({
            category: fields.text({ label: 'Category' }),
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Use Cases', itemLabel: (props) => props.fields.title.value }
        ),
        specs: fields.array(
          fields.object({ label: fields.text({ label: 'Label' }), value: fields.text({ label: 'Value' }) }),
          { label: 'Specs', itemLabel: (props) => props.fields.label.value }
        ),
        howItWorks: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'How It Works Steps', itemLabel: (props) => props.fields.title.value }
        ),
        privacyFeatures: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Privacy Features', itemLabel: (props) => props.fields.title.value }
        ),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          secondaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'CTA' }),
      },
    }),

    // ─── STACK PAGE ───
    'stack-page': singleton({
      label: 'Stack Page',
      path: 'src/content/singletons/stack-page',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Hero' }),
        quickStats: fields.array(
          fields.object({ value: fields.text({ label: 'Value' }), label: fields.text({ label: 'Label' }) }),
          { label: 'Quick Stats', itemLabel: (props) => props.fields.label.value }
        ),
        layers: fields.array(
          fields.object({
            number: fields.text({ label: 'Number' }),
            name: fields.text({ label: 'Name' }),
            tagline: fields.text({ label: 'Tagline' }),
            description: fields.text({ label: 'Description', multiline: true }),
            products: fields.array(
              fields.object({ name: fields.text({ label: 'Name' }), desc: fields.text({ label: 'Description' }) }),
              { label: 'Products', itemLabel: (props) => props.fields.name.value }
            ),
          }),
          { label: 'Layers', itemLabel: (props) => props.fields.name.value }
        ),
        designPrinciples: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Design Principles', itemLabel: (props) => props.fields.title.value }
        ),
        layerIntegration: fields.array(
          fields.object({
            step: fields.integer({ label: 'Step Number' }),
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description' }),
          }),
          { label: 'Layer Integration Steps', itemLabel: (props) => props.fields.title.value }
        ),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          secondaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'CTA' }),
      },
    }),

    // ─── SOLUTIONS OVERVIEW ───
    'solutions-overview': singleton({
      label: 'Solutions Overview',
      path: 'src/content/singletons/solutions-overview',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Hero' }),
        industryCards: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
            href: fields.text({ label: 'URL' }),
            features: fields.array(fields.text({ label: 'Feature' }), { label: 'Features' }),
          }),
          { label: 'Industry Cards', itemLabel: (props) => props.fields.title.value }
        ),
        outcomeCards: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
            href: fields.text({ label: 'URL' }),
          }),
          { label: 'Outcome Cards', itemLabel: (props) => props.fields.title.value }
        ),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          secondaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'CTA' }),
      },
    }),

    // ─── IMPACT OVERVIEW ───
    'impact-overview': singleton({
      label: 'Impact Overview',
      path: 'src/content/singletons/impact-overview',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Hero' }),
        stats: fields.array(
          fields.object({ value: fields.text({ label: 'Value' }), label: fields.text({ label: 'Label' }) }),
          { label: 'Stats', itemLabel: (props) => props.fields.label.value }
        ),
        navCards: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description' }),
            href: fields.text({ label: 'URL' }),
          }),
          { label: 'Nav Cards', itemLabel: (props) => props.fields.title.value }
        ),
        regionalHighlights: fields.array(
          fields.object({
            region: fields.text({ label: 'Region' }),
            description: fields.text({ label: 'Description', multiline: true }),
            story: fields.text({ label: 'Story', multiline: true }),
          }),
          { label: 'Regional Highlights', itemLabel: (props) => props.fields.region.value }
        ),
        testimonialQuote: fields.object({
          text: fields.text({ label: 'Quote', multiline: true }),
          attribution: fields.text({ label: 'Attribution' }),
          role: fields.text({ label: 'Role' }),
        }, { label: 'Testimonial Quote' }),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          secondaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'CTA' }),
      },
    }),

    // ─── CASE STUDIES PAGE ───
    'case-studies-page': singleton({
      label: 'Case Studies Page',
      path: 'src/content/singletons/case-studies-page',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Hero' }),
        categoryFilters: fields.array(
          fields.text({ label: 'Category' }),
          { label: 'Category Filters' }
        ),
        featuredTitle: fields.text({ label: 'Featured Section Title' }),
        allTitle: fields.text({ label: 'All Studies Section Title' }),
      },
    }),

    // ─── METRICS PAGE ───
    'metrics-page': singleton({
      label: 'Metrics Page',
      path: 'src/content/singletons/metrics-page',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Hero' }),
        primaryMetrics: fields.array(
          fields.object({
            value: fields.text({ label: 'Value' }),
            label: fields.text({ label: 'Label' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Primary Metrics', itemLabel: (props) => props.fields.label.value }
        ),
        secondaryMetrics: fields.array(
          fields.object({ value: fields.text({ label: 'Value' }), label: fields.text({ label: 'Label' }) }),
          { label: 'Secondary Metrics', itemLabel: (props) => props.fields.label.value }
        ),
        impactStories: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Impact Stories', itemLabel: (props) => props.fields.title.value }
        ),
        methodology: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Methodology' }),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          secondaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'CTA' }),
      },
    }),

    // ─── NETWORK MAP PAGE ───
    'network-map-page': singleton({
      label: 'Network Map Page',
      path: 'src/content/singletons/network-map-page',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Hero' }),
        liveStats: fields.array(
          fields.object({
            value: fields.number({ label: 'Value' }),
            suffix: fields.text({ label: 'Suffix' }),
            label: fields.text({ label: 'Label' }),
          }),
          { label: 'Live Stats', itemLabel: (props) => props.fields.label.value }
        ),
        regionalDistribution: fields.array(
          fields.object({
            region: fields.text({ label: 'Region' }),
            nodes: fields.text({ label: 'Nodes' }),
            growth: fields.text({ label: 'Growth' }),
            description: fields.text({ label: 'Description' }),
          }),
          { label: 'Regional Distribution', itemLabel: (props) => props.fields.region.value }
        ),
        recentDeployments: fields.array(
          fields.object({
            location: fields.text({ label: 'Location' }),
            nodes: fields.text({ label: 'Nodes' }),
            status: fields.text({ label: 'Status' }),
          }),
          { label: 'Recent Deployments', itemLabel: (props) => props.fields.location.value }
        ),
        networkArchitecture: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Network Architecture', itemLabel: (props) => props.fields.title.value }
        ),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          secondaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'CTA' }),
      },
    }),

    // ─── TRUST CENTER PAGE ───
    'trust-center-page': singleton({
      label: 'Trust Center Page',
      path: 'src/content/singletons/trust-center-page',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Hero' }),
        securityItems: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Security Items', itemLabel: (props) => props.fields.title.value }
        ),
        complianceItems: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Compliance Items', itemLabel: (props) => props.fields.title.value }
        ),
        certifications: fields.array(
          fields.text({ label: 'Certification' }),
          { label: 'Certifications' }
        ),
        documents: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description' }),
            access: fields.text({ label: 'Access Level' }),
          }),
          { label: 'Documents', itemLabel: (props) => props.fields.title.value }
        ),
        incidentResponse: fields.object({
          responseTime: fields.text({ label: 'Response Time' }),
          monitoring: fields.text({ label: 'Monitoring' }),
          notification: fields.text({ label: 'Notification Time' }),
        }, { label: 'Incident Response' }),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
        }, { label: 'CTA' }),
      },
    }),

    // ─── NEWSROOM PAGE ───
    'newsroom-page': singleton({
      label: 'Newsroom Page',
      path: 'src/content/singletons/newsroom-page',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Hero' }),
        mediaContact: fields.object({
          name: fields.text({ label: 'Name' }),
          role: fields.text({ label: 'Role' }),
          email: fields.text({ label: 'Email' }),
        }, { label: 'Media Contact' }),
        pressKitItems: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description' }),
          }),
          { label: 'Press Kit Items', itemLabel: (props) => props.fields.title.value }
        ),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          ctaText: fields.text({ label: 'CTA Text' }),
          ctaHref: fields.text({ label: 'CTA URL' }),
        }, { label: 'CTA' }),
      },
    }),

    // ─── DOCS PAGE ───
    'docs-page': singleton({
      label: 'Documentation Page',
      path: 'src/content/singletons/docs-page',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Hero' }),
        docCategories: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description' }),
            items: fields.array(fields.text({ label: 'Item' }), { label: 'Items' }),
          }),
          { label: 'Doc Categories', itemLabel: (props) => props.fields.title.value }
        ),
        sdks: fields.array(
          fields.object({
            language: fields.text({ label: 'Language' }),
            installCommand: fields.text({ label: 'Install Command' }),
            badge: fields.text({ label: 'Badge/Version' }),
          }),
          { label: 'SDKs', itemLabel: (props) => props.fields.language.value }
        ),
        supportChannels: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description' }),
            href: fields.text({ label: 'URL' }),
          }),
          { label: 'Support Channels', itemLabel: (props) => props.fields.title.value }
        ),
        cta: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
          primaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Primary CTA' }),
          secondaryCta: fields.object({ text: fields.text({ label: 'Text' }), href: fields.text({ label: 'URL' }) }, { label: 'Secondary CTA' }),
        }, { label: 'CTA' }),
      },
    }),

    // ─── LAST MILE PAGE ───
    'last-mile-page': singleton({
      label: 'Last Mile Page',
      path: 'src/content/singletons/last-mile-page',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Hero' }),
        stats: fields.array(
          fields.object({ value: fields.text({ label: 'Value' }), label: fields.text({ label: 'Label' }) }),
          { label: 'Stats', itemLabel: (props) => props.fields.label.value }
        ),
        topicFilters: fields.array(
          fields.text({ label: 'Topic' }),
          { label: 'Topic Filters' }
        ),
        aboutSection: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'About Section' }),
      },
    }),

    // ─── RESOURCES OVERVIEW ───
    'resources-overview': singleton({
      label: 'Resources Overview',
      path: 'src/content/singletons/resources-overview',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow' }),
          headline: fields.text({ label: 'Headline' }),
          headlineAccent: fields.text({ label: 'Headline Accent' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Hero' }),
        resourceSections: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description' }),
            href: fields.text({ label: 'URL' }),
            items: fields.array(fields.text({ label: 'Item' }), { label: 'Items' }),
          }),
          { label: 'Resource Sections', itemLabel: (props) => props.fields.title.value }
        ),
        quickLinks: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description' }),
            href: fields.text({ label: 'URL' }),
          }),
          { label: 'Quick Links', itemLabel: (props) => props.fields.title.value }
        ),
        newsletter: fields.object({
          headline: fields.text({ label: 'Headline' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }, { label: 'Newsletter Section' }),
      },
    }),

    // ─── PRIVACY PAGE ───
    'privacy-page': singleton({
      label: 'Privacy Policy',
      path: 'src/content/singletons/privacy-page/',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title' }),
        lastUpdated: fields.text({ label: 'Last Updated' }),
        body: fields.mdx({ label: 'Content' }),
      },
    }),

    // ─── TERMS PAGE ───
    'terms-page': singleton({
      label: 'Terms of Service',
      path: 'src/content/singletons/terms-page/',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title' }),
        lastUpdated: fields.text({ label: 'Last Updated' }),
        body: fields.mdx({ label: 'Content' }),
      },
    }),
  },
});
