import { defineMiddleware } from 'astro:middleware';

const READ_ONLY_BANNER = `
<style>
  body { padding-top: 40px !important; }
  .ks-readonly-banner {
    position: fixed; top: 0; left: 0; right: 0; z-index: 2147483647;
    background: #d97706; color: #000; padding: 8px 16px;
    font: 600 13px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .ks-readonly-banner a { color: #000; text-decoration: underline; margin-left: 8px; }
  /* Disable mutation buttons via CSS — branch protection is the real enforcement */
  button[aria-label*="Create"], button[aria-label*="Save"], button[aria-label*="Delete"],
  button[aria-label*="create"], button[aria-label*="save"], button[aria-label*="delete"] {
    opacity: 0.4 !important; pointer-events: none !important;
  }
</style>
<div class="ks-readonly-banner">
  READ-ONLY — You are viewing main.
  <a href="/admin">Go to Admin Dashboard</a>
</div>`;

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Inject GitHub token cookie for Keystatic routes
  if (pathname.startsWith('/keystatic') || pathname.startsWith('/api/keystatic')) {
    const runtime = (context.locals as any).runtime;
    const token = runtime?.env?.GITHUB_TOKEN;
    if (token && !context.cookies.get('keystatic-gh-access-token')?.value) {
      context.cookies.set('keystatic-gh-access-token', token, {
        path: '/',
        sameSite: 'lax',
        secure: import.meta.env.PROD,
        httpOnly: false,
        maxAge: 60 * 60 * 24,
      });
    }
  }

  // Redirect /keystatic or /keystatic/ to /admin
  if (pathname === '/keystatic' || pathname === '/keystatic/') {
    return context.redirect('/admin', 302);
  }

  const response = await next();

  // Inject read-only CSS banner on main branch Keystatic pages
  if (pathname.startsWith('/keystatic/branch/main')) {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/html')) {
      const html = await response.text();
      const modified = html + READ_ONLY_BANNER;
      return new Response(modified, {
        status: response.status,
        headers: response.headers,
      });
    }
  }

  return response;
});
