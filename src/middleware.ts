import { defineMiddleware } from 'astro:middleware';

const READ_ONLY_BANNER = `
<style>
  body { padding-top: 44px !important; }
  .ks-readonly-banner {
    position: fixed; top: 0; left: 0; right: 0; z-index: 2147483647;
    background: #d97706; color: #000; padding: 10px 16px;
    font: 600 13px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .ks-readonly-banner a { color: #000; text-decoration: underline; margin-left: 8px; }
  /* Disabled state for buttons and inputs */
  .ks-disabled {
    opacity: 0.35 !important;
    pointer-events: none !important;
    cursor: not-allowed !important;
    user-select: none !important;
  }
</style>
<div class="ks-readonly-banner">
  READ-ONLY &#8212; You are viewing main. Editing is disabled.
  <a href="/admin">Go to Admin Dashboard</a>
</div>
<script>
(function() {
  function disableNode(el) {
    if (el.closest && el.closest('.ks-readonly-banner')) return;
    if (el.tagName === 'BUTTON') { el.disabled = true; el.classList.add('ks-disabled'); }
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
      el.disabled = true; el.readOnly = true; el.classList.add('ks-disabled');
    }
    if (el.getAttribute && el.getAttribute('contenteditable') === 'true') {
      el.setAttribute('contenteditable', 'false'); el.classList.add('ks-disabled');
    }
  }
  function disableTree(root) {
    root.querySelectorAll('button, input, textarea, select, [contenteditable="true"]').forEach(disableNode);
  }
  // Initial pass
  disableTree(document.body);
  // Only process added nodes, debounced via rAF
  var pending = false;
  var queue = [];
  new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var added = mutations[i].addedNodes;
      for (var j = 0; j < added.length; j++) {
        if (added[j].nodeType === 1) queue.push(added[j]);
      }
    }
    if (!pending && queue.length) {
      pending = true;
      requestAnimationFrame(function() {
        for (var k = 0; k < queue.length; k++) {
          disableNode(queue[k]);
          if (queue[k].querySelectorAll) disableTree(queue[k]);
        }
        queue = [];
        pending = false;
      });
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
</script>`;

const ADMIN_NAV_BUTTON = `
<style>
  .ks-admin-nav {
    position: fixed; bottom: 1.25rem; right: 1.25rem; z-index: 2147483640;
    display: flex; gap: 0.5rem; align-items: center;
  }
  .ks-admin-nav a {
    display: inline-flex; align-items: center; gap: 0.375rem;
    padding: 0.5rem 1rem; border-radius: 0.5rem;
    font: 500 13px/1.25 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    text-decoration: none; transition: all 0.15s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  .ks-admin-nav .ks-nav-admin {
    background: #3b82f6; color: #fff;
  }
  .ks-admin-nav .ks-nav-admin:hover { background: #2563eb; }
  .ks-admin-nav .ks-nav-admin svg { width: 14px; height: 14px; }
</style>
<div class="ks-admin-nav">
  <a href="/admin" class="ks-nav-admin">
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6l6-4.5L14 6v7.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 13.5z"/><path d="M6 15V8h4v7"/></svg>
    Admin
  </a>
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

  // Block Keystatic API write operations from main branch view
  // (GitHub branch protection is the real enforcement — this is defense-in-depth)
  if (pathname.startsWith('/api/keystatic')) {
    const method = context.request.method.toUpperCase();
    if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
      const referer = context.request.headers.get('referer') || '';
      if (referer.includes('/keystatic/branch/main')) {
        return new Response(JSON.stringify({ error: 'Main branch is read-only' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }

  const response = await next();

  // Inject banners on Keystatic pages
  if (pathname.startsWith('/keystatic/branch/')) {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/html')) {
      const html = await response.text();
      const isMain = pathname.startsWith('/keystatic/branch/main');
      const injection = isMain ? READ_ONLY_BANNER : ADMIN_NAV_BUTTON;
      return new Response(html + injection, {
        status: response.status,
        headers: response.headers,
      });
    }
  }

  return response;
});
