import { useState, useEffect } from 'react';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

interface HeaderCta {
  secondaryText?: string;
  secondaryHref?: string;
  primaryText?: string;
  primaryHref?: string;
}

const defaultNavigation: NavItem[] = [
  {
    label: 'Platform',
    href: '/platform',
    children: [
      { label: 'The Trueleap Stack', href: '/platform/stack' },
      { label: 'Physical Infrastructure', href: '/platform/infrastructure' },
      { label: 'Digital Systems', href: '/platform/digital-systems' },
      { label: 'Edge AI Engine', href: '/platform/edge-ai' },
    ],
  },
  {
    label: 'Solutions',
    href: '/solutions',
    children: [
      { label: 'Governments', href: '/solutions/industry/governments' },
      { label: 'Education', href: '/solutions/industry/education' },
      { label: 'NGOs', href: '/solutions/industry/ngos' },
      { label: 'Enterprise', href: '/solutions/industry/enterprise' },
      { label: 'Digital Sovereignty', href: '/solutions/outcome/digital-sovereignty' },
      { label: 'Workforce Readiness', href: '/solutions/outcome/workforce-readiness' },
      { label: 'Rural Connectivity', href: '/solutions/outcome/rural-connectivity' },
    ],
  },
  {
    label: 'Global Impact',
    href: '/impact',
    children: [
      { label: 'Live Network Map', href: '/impact/network-map' },
      { label: 'Impact Data', href: '/impact/metrics' },
      { label: 'Case Studies', href: '/impact/case-studies' },
      { label: 'The Last Mile', href: '/impact/last-mile' },
    ],
  },
  {
    label: 'Company',
    href: '/company',
    children: [
      { label: 'Mission & Vision', href: '/company/mission' },
      { label: 'Leadership', href: '/company/leadership' },
      { label: 'Partners', href: '/company/partners' },
      { label: 'Careers', href: '/company/careers' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'Trust Center', href: '/resources/trust-center' },
      { label: 'Newsroom', href: '/resources/newsroom' },
      { label: 'Documentation', href: '/resources/docs' },
    ],
  },
];

const defaultHeaderCta: HeaderCta = {
  secondaryText: 'Careers',
  secondaryHref: '/company/careers',
  primaryText: 'Contact Us',
  primaryHref: '/company/contact',
};

interface HeaderProps {
  lang?: string;
  variant?: 'light' | 'dark' | 'transparent';
  navigationData?: NavItem[];
  headerCta?: HeaderCta;
}

export function Header({ lang = 'en', variant = 'transparent', navigationData, headerCta }: HeaderProps) {
  const navigation = navigationData ?? defaultNavigation;
  const cta = headerCta ?? defaultHeaderCta;
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isTransparent = variant === 'transparent' && !scrolled;
  const textColor = isTransparent ? 'text-charcoal' : 'text-charcoal';
  // Glassmorphic background - always has frosted glass effect, more prominent when scrolled
  const bgClass = scrolled 
    ? 'bg-cream/80 backdrop-blur-xl border-b border-white/30 shadow-sm' 
    : 'bg-cream/40 backdrop-blur-md';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}
      style={{ transitionTimingFunction: 'var(--ease-premium)' }}
    >
      <nav className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a 
          href={`/${lang}`} 
          className="transition-opacity duration-300 hover:opacity-80"
        >
          <img 
            src="/trueleap-logo.svg" 
            alt="TrueLeap" 
            className="h-12 w-auto"
          />
        </a>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href={`/${lang}${item.href}`}
                className={`
                  px-4 py-2 text-[0.9375rem] font-medium ${textColor}
                  transition-colors relative group inline-flex items-center gap-1
                  hover:text-primary
                `}
                style={{ transitionDuration: 'var(--duration-normal)' }}
              >
                {item.label}
                {item.children && (
                  <svg 
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </a>

              {/* Dropdown */}
              {item.children && (
                <div 
                  className={`
                    absolute top-full left-1/2 -translate-x-1/2 pt-3
                    transition-all duration-300
                    ${activeDropdown === item.label 
                      ? 'opacity-100 translate-y-0 pointer-events-auto' 
                      : 'opacity-0 -translate-y-2 pointer-events-none'}
                  `}
                  style={{ transitionTimingFunction: 'var(--ease-premium)' }}
                >
                  <ul className="bg-white py-3 min-w-[240px] border border-border/50 rounded-lg shadow-md">
                    {item.children.map((child, index) => (
                      <li key={child.label}>
                        <a
                          href={`/${lang}${child.href}`}
                          className="
                            block px-5 py-2.5 text-[0.9375rem] text-charcoal/80
                            hover:text-charcoal hover:bg-cream/80
                            transition-colors
                          "
                          style={{ 
                            transitionDuration: 'var(--duration-fast)',
                          }}
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={`/${lang}${cta.secondaryHref}`}
            className={`text-[0.9375rem] font-medium ${textColor} hover:text-primary transition-colors`}
            style={{ transitionDuration: 'var(--duration-normal)' }}
          >
            {cta.secondaryText}
          </a>
          <a
            href={`/${lang}${cta.primaryHref}`}
            className="
              inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
              text-[0.9375rem] font-medium text-white
              bg-primary border border-primary shadow-sm
              hover:bg-primary-light hover:border-primary-light hover:shadow-md
              transition-all
            "
            style={{ transitionDuration: 'var(--duration-normal)', transitionTimingFunction: 'var(--ease-premium)' }}
          >
            {cta.primaryText}
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`lg:hidden p-2 -mr-2 ${textColor}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <div className="w-6 h-5 flex flex-col justify-center items-center relative">
            <span 
              className={`
                block h-0.5 w-6 bg-current rounded-full transition-all duration-300
                ${mobileOpen ? 'absolute rotate-45' : 'mb-1.5'}
              `}
              style={{ transitionTimingFunction: 'var(--ease-premium)' }}
            />
            <span 
              className={`
                block h-0.5 w-6 bg-current rounded-full transition-all duration-300
                ${mobileOpen ? 'opacity-0' : 'mb-1.5'}
              `}
            />
            <span 
              className={`
                block h-0.5 w-6 bg-current rounded-full transition-all duration-300
                ${mobileOpen ? 'absolute -rotate-45' : ''}
              `}
              style={{ transitionTimingFunction: 'var(--ease-premium)' }}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`
          lg:hidden fixed inset-0 top-20 bg-cream z-40 
          transition-all duration-500 overflow-y-auto
          ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        style={{ transitionTimingFunction: 'var(--ease-premium)' }}
      >
        <ul className="px-6 py-8 space-y-2">
          {navigation.map((item, itemIndex) => (
            <li 
              key={item.label}
              className={`
                transition-all duration-500
                ${mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{ 
                transitionDelay: mobileOpen ? `${itemIndex * 50}ms` : '0ms',
                transitionTimingFunction: 'var(--ease-out-expo)'
              }}
            >
              <a
                href={`/${lang}${item.href}`}
                className="block text-2xl font-medium text-charcoal py-3 border-b border-border/50"
              >
                {item.label}
              </a>
              {item.children && (
                <ul className="py-2 space-y-1">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <a
                        href={`/${lang}${child.href}`}
                        className="block py-2 pl-4 text-charcoal/70 hover:text-charcoal transition-colors"
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        
        {/* Mobile CTA */}
        <div 
          className={`
            px-6 pb-8 pt-4 transition-all duration-500
            ${mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ 
            transitionDelay: mobileOpen ? `${navigation.length * 50 + 100}ms` : '0ms',
            transitionTimingFunction: 'var(--ease-out-expo)'
          }}
        >
          <a
            href={`/${lang}${cta.primaryHref}`}
            className="
              w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg
              text-lg font-medium text-white
              bg-primary border border-primary shadow-sm
            "
          >
            {cta.primaryText}
          </a>
        </div>
      </div>
    </header>
  );
}
