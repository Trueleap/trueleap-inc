import { defineMiddleware } from 'astro:middleware';

const BRANCH_GUARD_SCRIPT = `
<script>
(function() {
  var overlay = null;
  var banner = null;

  function isOnMain() {
    return window.location.pathname.startsWith('/keystatic') &&
           !window.location.pathname.includes('/branch/');
  }

  function isEditPage() {
    var p = window.location.pathname;
    return /\\/keystatic\\/(singleton|collection)\\//.test(p) && !p.endsWith('/keystatic');
  }

  function createBanner() {
    if (banner) return;
    banner = document.createElement('div');
    banner.id = 'branch-banner';
    banner.innerHTML = '<span>You are viewing live content on <strong>main</strong>. Create a new branch to start editing.</span>';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:#d97706;color:#000;padding:10px 16px;font:14px/1.4 -apple-system,sans-serif;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);';
    document.body.appendChild(banner);
  }

  function removeBanner() {
    if (banner) { banner.remove(); banner = null; }
  }

  function createOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'branch-overlay';
    overlay.innerHTML =
      '<div style="background:#171717;border:1px solid #404040;border-radius:12px;padding:32px;max-width:420px;text-align:center;">' +
        '<h2 style="font-size:18px;font-weight:600;color:#f5f5f5;margin:0 0 12px;">Create a branch first</h2>' +
        '<p style="color:#a3a3a3;margin:0 0 24px;line-height:1.5;">You cannot edit on the <strong style="color:#d97706;">main</strong> branch directly. Use the branch picker (top-left) to create a new branch, then make your edits.</p>' +
        '<button onclick="history.back()" style="background:#2563eb;color:#fff;border:none;padding:10px 24px;border-radius:6px;cursor:pointer;font-size:14px;">Go Back</button>' +
      '</div>';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;font-family:-apple-system,sans-serif;';
    document.body.appendChild(overlay);
  }

  function removeOverlay() {
    if (overlay) { overlay.remove(); overlay = null; }
  }

  function check() {
    if (isOnMain()) {
      createBanner();
      if (isEditPage()) { createOverlay(); } else { removeOverlay(); }
    } else {
      removeBanner();
      removeOverlay();
    }
  }

  // Check on load and on SPA navigation
  check();
  var observer = new MutationObserver(check);
  observer.observe(document.querySelector('title') || document.head, { childList: true, subtree: true, characterData: true });
  setInterval(check, 1000);
})();
</script>`;

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Auto-inject GitHub token for Keystatic routes so editors
  // only need Google login (via Cloudflare Access) — no GitHub account required.
  if (pathname.startsWith('/keystatic') || pathname.startsWith('/api/keystatic')) {
    const runtime = (context.locals as any).runtime;
    const token = runtime?.env?.GITHUB_TOKEN;
    if (token && !context.cookies.get('keystatic-gh-access-token')?.value) {
      context.cookies.set('keystatic-gh-access-token', token, {
        path: '/',
        sameSite: 'lax',
        secure: import.meta.env.PROD,
        httpOnly: false,
        maxAge: 60 * 60 * 24, // 24 hours — matches CF Access session
      });
    }
  }

  const response = await next();

  // Inject branch guard script into Keystatic HTML pages
  if (pathname.startsWith('/keystatic')) {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/html')) {
      const html = await response.text();
      const modified = html.replace('</head>', BRANCH_GUARD_SCRIPT + '</head>');
      return new Response(modified, {
        status: response.status,
        headers: response.headers,
      });
    }
  }

  return response;
});
