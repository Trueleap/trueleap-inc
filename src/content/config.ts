import { defineCollection, z } from 'astro:content';

// Case studies collection
const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    client: z.string(),
    category: z.string().optional(),
    industry: z.enum(['governments', 'education', 'ngos', 'enterprise']),
    region: z.string(),
    country: z.string().optional(),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
    quote: z.object({
      text: z.string(),
      attribution: z.string(),
      role: z.string().optional(),
    }).optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    publishedAt: z.date(),
  }),
});

// News/blog collection
const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().optional(),
    category: z.enum(['press', 'update', 'thought-leadership']),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    publishedAt: z.date(),
  }),
});

// Team members
const team = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    title: z.string().optional(),
    bio: z.string(),
    initials: z.string().optional(),
    image: z.string().optional(),
    linkedin: z.string().optional(),
    category: z.enum(['executive', 'advisory']).default('executive'),
    affiliation: z.string().optional(),
    order: z.number().default(0),
  }),
});

// Partners
const partners = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    logo: z.string().optional(),
    url: z.string().optional(),
    tier: z.enum(['strategic', 'technology', 'implementation', 'institutional']),
    type: z.string().optional(),
    description: z.string().optional(),
    order: z.number().default(0),
  }),
});

// Jobs
const jobs = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    department: z.string(),
    location: z.string(),
    type: z.string(),
    description: z.string(),
    active: z.boolean().default(true),
    order: z.number().default(0),
  }),
});

// Testimonials
const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    quote: z.string(),
    attribution: z.string(),
    role: z.string().optional(),
    order: z.number().default(0),
  }),
});

// Industry solutions
const industrySolutions = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    headline: z.string(),
    headlineAccent: z.string(),
    description: z.string(),
    ctaPrimary: z.object({ text: z.string(), href: z.string() }).optional(),
    ctaSecondary: z.object({ text: z.string(), href: z.string() }).optional(),
    benefits: z.array(z.object({
      metric: z.string(),
      label: z.string(),
      description: z.string(),
    })).optional(),
    useCases: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),
    caseStudy: z.object({
      country: z.string(),
      title: z.string(),
      description: z.string(),
      results: z.array(z.object({ metric: z.string(), label: z.string() })),
    }).optional(),
    whyCards: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),
    ctaSection: z.object({
      headline: z.string(),
      description: z.string(),
      primaryCta: z.object({ text: z.string(), href: z.string() }),
      secondaryCta: z.object({ text: z.string(), href: z.string() }),
    }).optional(),
  }),
});

// Outcome solutions
const outcomeSolutions = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    headline: z.string(),
    headlineAccent: z.string(),
    description: z.string(),
    ctaPrimary: z.object({ text: z.string(), href: z.string() }).optional(),
    ctaSecondary: z.object({ text: z.string(), href: z.string() }).optional(),
    stats: z.array(z.object({
      value: z.string(),
      label: z.string(),
      description: z.string().optional(),
    })).optional(),
    pillars: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),
    useCases: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),
    ctaSection: z.object({
      headline: z.string(),
      description: z.string(),
      primaryCta: z.object({ text: z.string(), href: z.string() }),
      secondaryCta: z.object({ text: z.string(), href: z.string() }),
    }).optional(),
  }),
});

export const collections = {
  'case-studies': caseStudies,
  news,
  team,
  partners,
  jobs,
  testimonials,
  'industry-solutions': industrySolutions,
  'outcome-solutions': outcomeSolutions,
};
