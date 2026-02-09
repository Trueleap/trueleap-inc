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

const PDF_IMPORT_INJECTION = `
<style>
  .ks-pdf-zone {
    border: 2px dashed #d1d5db; border-radius: 0.5rem; padding: 1.25rem;
    text-align: center; cursor: pointer; transition: all 0.15s;
    background: #faf5ff; margin-top: 0.5rem;
  }
  .ks-pdf-zone:hover, .ks-pdf-zone.dragover { border-color: #8b5cf6; background: #f3e8ff; }
  .ks-pdf-zone input[type="file"] { display: none; }
  .ks-pdf-zone p { margin: 0.25rem 0; }
  .ks-pdf-zone .ks-pdf-icon { font-size: 24px; margin-bottom: 0.25rem; }
  .ks-pdf-zone .ks-pdf-label {
    font: 600 14px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #7c3aed;
  }
  .ks-pdf-zone .ks-pdf-hint {
    font: 400 12px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #9ca3af;
  }
  .ks-pdf-status {
    margin-top: 0.5rem; padding: 0.75rem; border-radius: 0.375rem;
    font: 400 13px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    display: none;
  }
  .ks-pdf-status.loading { display: block; background: #f0fdf4; color: #15803d; }
  .ks-pdf-status.error { display: block; background: #fef2f2; color: #dc2626; }
  .ks-pdf-status.success { display: block; background: #f0fdf4; color: #15803d; }
  .ks-pdf-filled-badge {
    display: inline-flex; align-items: center; gap: 0.25rem;
    padding: 0.125rem 0.5rem; border-radius: 9999px;
    font: 500 11px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #dbeafe; color: #1d4ed8;
  }
</style>
<script>
(function() {
  var nativeSet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  var nativeTextSet = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;

  function setInputValue(input, val) {
    if (input.tagName === 'TEXTAREA') {
      nativeTextSet.call(input, val);
    } else {
      nativeSet.call(input, val);
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function findFieldByLabel(labelText) {
    var labels = document.querySelectorAll('label, span');
    for (var i = 0; i < labels.length; i++) {
      if (labels[i].textContent.trim() === labelText) {
        var container = labels[i].closest('[data-field], fieldset, [class]');
        if (!container) container = labels[i].parentElement;
        // Walk up a few levels to find the field group
        for (var el = labels[i]; el && el !== document.body; el = el.parentElement) {
          var input = el.querySelector('input, textarea, select');
          if (input) return input;
        }
      }
    }
    return null;
  }

  function setSelectValue(selectEl, val) {
    for (var i = 0; i < selectEl.options.length; i++) {
      if (selectEl.options[i].value === val || selectEl.options[i].text === val) {
        selectEl.selectedIndex = i;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
    }
    return false;
  }

  function fillField(labelText, value, isSelect) {
    if (!value) return;
    var el = findFieldByLabel(labelText);
    if (!el) return;
    if (isSelect && el.tagName === 'SELECT') {
      setSelectValue(el, value);
    } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      setInputValue(el, value);
    }
  }

  function injectUploadZone() {
    // Find the pdfUrl field by its label text
    var labels = document.querySelectorAll('label, span');
    var pdfLabel = null;
    for (var i = 0; i < labels.length; i++) {
      if (labels[i].textContent.trim() === 'Source PDF (R2 key)') {
        pdfLabel = labels[i];
        break;
      }
    }
    if (!pdfLabel) return false;

    // Find the field container (walk up to the field group)
    var fieldContainer = pdfLabel;
    for (var j = 0; j < 5; j++) {
      if (fieldContainer.parentElement) fieldContainer = fieldContainer.parentElement;
    }

    // Don't inject twice
    if (fieldContainer.querySelector('.ks-pdf-zone')) return true;

    // Find the existing text input and hide it
    var existingInput = fieldContainer.querySelector('input[type="text"]');
    if (existingInput) existingInput.style.display = 'none';
    // Also hide the description text
    var desc = fieldContainer.querySelector('span');
    if (desc && desc.textContent.includes('Auto-filled')) desc.style.display = 'none';

    // Create upload zone
    var zone = document.createElement('div');
    zone.className = 'ks-pdf-zone';
    zone.innerHTML = '<div class="ks-pdf-icon">&#128196;</div>'
      + '<p class="ks-pdf-label">Upload Job Description PDF</p>'
      + '<p class="ks-pdf-hint">Click or drag &amp; drop &#183; Max 20 MB &#183; All fields will be auto-filled</p>'
      + '<input type="file" accept=".pdf,application/pdf" />';
    fieldContainer.appendChild(zone);

    var status = document.createElement('div');
    status.className = 'ks-pdf-status';
    fieldContainer.appendChild(status);

    var fileInput = zone.querySelector('input[type="file"]');
    zone.addEventListener('click', function(e) { if (e.target !== fileInput) fileInput.click(); });
    zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', function() { zone.classList.remove('dragover'); });
    zone.addEventListener('drop', function(e) {
      e.preventDefault(); zone.classList.remove('dragover');
      if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0], zone, status, existingInput);
    });
    fileInput.addEventListener('change', function() {
      if (fileInput.files.length) handleFile(fileInput.files[0], zone, status, existingInput);
    });

    return true;
  }

  function handleFile(file, zone, status, pdfInput) {
    if (file.type !== 'application/pdf') {
      showStatus(status, 'error', 'Please select a PDF file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      showStatus(status, 'error', 'File exceeds 20 MB limit.');
      return;
    }
    zone.style.display = 'none';
    showStatus(status, 'loading', 'Uploading and extracting — this takes 10-20 seconds...');

    var form = new FormData();
    form.append('file', file);
    fetch('/api/jobs/extract-pdf', { method: 'POST', body: form })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) {
          showStatus(status, 'error', data.error);
          zone.style.display = '';
          return;
        }

        // Fill the pdfUrl hidden field
        if (data.pdfKey && pdfInput) {
          setInputValue(pdfInput, data.pdfKey);
        }

        // Fill structured fields
        var f = data.fields || {};
        fillField('Title', f.title, false);
        fillField('Department', f.department, true);
        fillField('Location', f.location, false);
        fillField('Type', f.type, true);
        fillField('Summary (for card listing)', f.summary, false);

        // Copy markdown to clipboard for pasting into body
        var bodyMsg = '';
        if (data.markdown) {
          navigator.clipboard.writeText(data.markdown).then(function() {
            showStatus(status, 'success',
              'All fields filled from "' + file.name + '". Body markdown copied to clipboard — paste it into the Full Description field below.');
          }).catch(function() {
            showStatus(status, 'success',
              'All fields filled from "' + file.name + '". Copy the body text manually from the text area below.');
            // Show a textarea fallback for the markdown
            var ta = document.createElement('textarea');
            ta.value = data.markdown;
            ta.readOnly = true;
            ta.style.cssText = 'width:100%;min-height:120px;margin-top:0.5rem;font:12px/1.5 monospace;border:1px solid #d1d5db;border-radius:0.375rem;padding:0.5rem;';
            status.parentElement.appendChild(ta);
          });
          return;
        }

        showStatus(status, 'success', 'Fields filled from "' + file.name + '".');
      })
      .catch(function(err) {
        showStatus(status, 'error', 'Upload failed: ' + err.message);
        zone.style.display = '';
      });
  }

  function showStatus(el, type, msg) {
    el.className = 'ks-pdf-status ' + type;
    el.textContent = msg;
  }

  // Use MutationObserver to wait for Keystatic to render the field
  var injected = false;
  function tryInject() {
    if (injected) return;
    if (injectUploadZone()) injected = true;
  }
  // Try immediately and watch for DOM changes
  tryInject();
  var obs = new MutationObserver(function() { tryInject(); });
  obs.observe(document.body, { childList: true, subtree: true });
  // Stop observing once injected (cleanup)
  var checkInterval = setInterval(function() {
    if (injected) { obs.disconnect(); clearInterval(checkInterval); }
  }, 2000);
})();
</script>`;

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
      let injection = isMain ? READ_ONLY_BANNER : ADMIN_NAV_BUTTON;
      // Add PDF import upload zone on job editor pages (non-main branches)
      if (!isMain && /\/keystatic\/branch\/[^/]+\/collection\/jobs\//.test(pathname)) {
        injection += PDF_IMPORT_INJECTION;
      }
      return new Response(html + injection, {
        status: response.status,
        headers: response.headers,
      });
    }
  }

  return response;
});
