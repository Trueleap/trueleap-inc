import { defineMiddleware } from 'astro:middleware';

const CMS_URL = import.meta.env.PAYLOAD_URL ?? 'https://cms.trueleapinc.com';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Redirect /admin to Payload CMS admin panel
  if (pathname === '/admin' || pathname === '/admin/') {
    return context.redirect(`${CMS_URL}/admin`, 302);
  }

  // Redirect old Keystatic routes to admin
  if (pathname.startsWith('/keystatic')) {
    return context.redirect(`${CMS_URL}/admin`, 302);
  }

  return next();
});
