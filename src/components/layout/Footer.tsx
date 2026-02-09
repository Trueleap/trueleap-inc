import { Mono } from '../ui/Typography';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterGroup {
  label: string;
  links: FooterLink[];
}

const defaultFooterGroups: FooterGroup[] = [
  {
    label: 'Platform',
    links: [
      { label: 'The Stack', href: '/platform/stack' },
      { label: 'Infrastructure', href: '/platform/infrastructure' },
      { label: 'Digital Systems', href: '/platform/digital-systems' },
      { label: 'Edge AI', href: '/platform/edge-ai' },
    ],
  },
  {
    label: 'Company',
    links: [
      { label: 'Mission', href: '/company/mission' },
      { label: 'Leadership', href: '/company/leadership' },
      { label: 'Careers', href: '/company/careers' },
      { label: 'Partners', href: '/company/partners' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { label: 'Trust Center', href: '/resources/trust-center' },
      { label: 'Newsroom', href: '/resources/newsroom' },
      { label: 'Documentation', href: '/resources/docs' },
    ],
  },
  {
    label: 'Connect',
    links: [
      { label: 'LinkedIn', href: 'https://linkedin.com/company/trueleap', external: true },
      { label: 'Twitter', href: 'https://twitter.com/trueleap', external: true },
      { label: 'hello@trueleapinc.com', href: 'mailto:hello@trueleapinc.com', external: true },
    ],
  },
];

interface FooterProps {
  lang?: string;
  footerGroups?: FooterGroup[];
  footerQuote?: string;
  copyright?: string;
}

export function Footer({ lang = 'en', footerGroups, footerQuote, copyright }: FooterProps) {
  const groups = footerGroups ?? defaultFooterGroups;
  const quote = footerQuote ?? 'Connectivity is not a luxury. It is the foundation of opportunity.';
  const copyrightText = copyright ?? 'TrueLeap Inc.';
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-charcoal text-white pt-24 pb-8">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Quote */}
        <blockquote className="font-quote text-3xl md:text-4xl lg:text-5xl text-center max-w-3xl mx-auto mb-20 leading-tight">
          "{quote}"
        </blockquote>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {groups.map((group) => (
            <div key={group.label}>
              <Mono className="text-white/40 mb-4 block">{group.label}</Mono>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.external ? link.href : `/${lang}${link.href}`}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="text-white/70 hover:text-white transition-colors"
                      style={{ transitionDuration: 'var(--duration-normal)' }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Mono className="text-white/40">
            {year} {copyrightText}
          </Mono>
          <div className="flex gap-6">
            <a href={`/${lang}/privacy`} className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Privacy
            </a>
            <a href={`/${lang}/terms`} className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
