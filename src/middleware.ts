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
  .ks-extract-btn {
    display: inline-flex; align-items: center; gap: 0.375rem;
    padding: 0.375rem 0.75rem; border-radius: 0.5rem; border: none; cursor: pointer;
    font: 600 13px/1.25 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #7c3aed; color: #fff; transition: background 0.15s;
    margin-left: 0.5rem;
  }
  .ks-extract-btn:hover { background: #6d28d9; }
  .ks-extract-btn:disabled { opacity: 0.5; cursor: wait; }
  .ks-extract-btn svg { width: 14px; height: 14px; }
  .ks-pdf-status {
    margin-top: 0.5rem; padding: 0.75rem; border-radius: 0.375rem;
    font: 400 13px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .ks-pdf-status.hidden { display: none; }
  .ks-pdf-status.loading { background: #eff6ff; color: #1d4ed8; }
  .ks-pdf-status.error { background: #fef2f2; color: #dc2626; }
  .ks-pdf-status.success { background: #f0fdf4; color: #15803d; }
</style>
<script>
(function() {
  var nativeSet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  var nativeTextSet = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;

  // ── Set value on a React-controlled input ──
  function setInput(el, val) {
    if (!el) return;
    (el.tagName === 'TEXTAREA' ? nativeTextSet : nativeSet).call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // ── Find a field group by label text ──
  // Walks up from a leaf span/label with matching text to find the container.
  function findFieldGroup(labelText) {
    var els = document.querySelectorAll('label, span');
    for (var i = 0; i < els.length; i++) {
      if (els[i].children.length > 0) continue; // Only leaf text nodes
      if (els[i].textContent.trim() !== labelText) continue;
      // For file fields: look for role="group" ancestor
      var roleGroup = els[i].closest('[role="group"]');
      if (roleGroup) return roleGroup;
      // For other fields: walk up to find a container with inputs
      var el = els[i];
      for (var j = 0; j < 8 && el.parentElement; j++) {
        el = el.parentElement;
        if (el.querySelectorAll('input, textarea, button').length > 0
            && el.querySelectorAll('label, span[id]').length > 0) {
          return el;
        }
      }
    }
    return null;
  }

  // ── Fill the slug field (Title) ──
  function fillSlugField(value) {
    if (!value) return;
    // The slug field is the very first field group in the form.
    // It has a label "Title" and two text inputs (name + slug).
    var group = findFieldGroup('Title');
    if (!group) return;
    // First text input = name, second = slug
    var inputs = group.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type === 'text' || !inputs[i].type) {
        setInput(inputs[i], value);
        return; // Only set the first (name) input
      }
    }
  }

  // ── Fill a text or textarea field ──
  function fillTextField(labelText, value) {
    if (!value) return;
    var group = findFieldGroup(labelText);
    if (!group) return;
    var el = group.querySelector('textarea') || group.querySelector('input[type="text"], input:not([type])');
    if (el) setInput(el, value);
  }

  // ── Fill a Keystatic Picker (custom combobox) ──
  // Click trigger button -> wait for listbox popover -> click matching option.
  function fillPickerField(labelText, value, callback) {
    if (!value) { if (callback) callback(); return; }
    var group = findFieldGroup(labelText);
    if (!group) { if (callback) callback(); return; }
    var trigger = group.querySelector('button');
    if (!trigger) { if (callback) callback(); return; }
    trigger.click();
    setTimeout(function() {
      var listbox = document.querySelector('[role="listbox"]');
      if (listbox) {
        var options = listbox.querySelectorAll('[role="option"]');
        var matched = false;
        for (var i = 0; i < options.length; i++) {
          if (options[i].textContent.trim() === value) {
            options[i].click();
            matched = true;
            break;
          }
        }
        if (!matched) {
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        }
      }
      setTimeout(function() { if (callback) callback(); }, 100);
    }, 200);
  }

  // ── Fill the Slate MDX body editor ──
  // Keystatic uses Slate.js with a contenteditable div.
  // We simulate a paste event so Slate processes the markdown.
  function fillBodyEditor(markdown) {
    if (!markdown) return;
    // Find the Slate editor's contenteditable div (has data-slate-editor attribute)
    var editor = document.querySelector('[data-slate-editor="true"]')
                 || document.querySelector('[contenteditable="true"]');
    if (!editor) return;

    // Focus the editor first
    editor.focus();

    // Select all existing content so paste replaces it
    var sel = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(editor);
    sel.removeAllRanges();
    sel.addRange(range);

    // Create a paste event with our markdown
    var dt = new DataTransfer();
    dt.setData('text/plain', markdown);
    var pasteEvent = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: dt
    });
    editor.dispatchEvent(pasteEvent);
  }

  // ── Main setup ──
  function setup() {
    // Find the file field by its label
    var group = findFieldGroup('Upload Job Description PDF');
    if (!group) return false;
    if (group.querySelector('.ks-extract-btn')) return true; // Already injected

    // Find the button group inside the file field
    var btnGroup = null;
    var buttons = group.querySelectorAll('button');
    if (buttons.length > 0) {
      btnGroup = buttons[0].parentElement;
    }
    if (!btnGroup) {
      // If buttons haven't rendered yet, keep waiting
      return false;
    }

    // Create hidden file input
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,application/pdf';
    fileInput.style.display = 'none';
    group.appendChild(fileInput);

    // Create "Extract & Fill" button
    var extractBtn = document.createElement('button');
    extractBtn.type = 'button';
    extractBtn.className = 'ks-extract-btn';
    extractBtn.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">'
      + '<path d="M14 10v3a1 1 0 01-1 1H3a1 1 0 01-1-1v-3"/>'
      + '<path d="M4 7l4 4 4-4"/><path d="M8 11V2"/></svg>'
      + 'Extract &amp; Fill from PDF';
    btnGroup.appendChild(extractBtn);

    // Status area
    var status = document.createElement('div');
    status.className = 'ks-pdf-status hidden';
    group.appendChild(status);

    extractBtn.addEventListener('click', function() { fileInput.click(); });

    fileInput.addEventListener('change', function() {
      if (!fileInput.files.length) return;
      var file = fileInput.files[0];
      fileInput.value = '';

      if (file.type !== 'application/pdf') {
        showStatus(status, 'error', 'Please select a PDF file.');
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        showStatus(status, 'error', 'File exceeds 20 MB limit.');
        return;
      }

      extractBtn.disabled = true;
      showStatus(status, 'loading', 'Extracting text from PDF \\u2014 this may take 10-30 seconds...');

      var form = new FormData();
      form.append('file', file);
      fetch('/api/jobs/extract-pdf', { method: 'POST', body: form })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          extractBtn.disabled = false;
          if (data.error) {
            showStatus(status, 'error', data.error);
            return;
          }

          var f = data.fields || {};

          // Fill slug (title) first
          fillSlugField(f.title);

          // Fill pickers sequentially (each opens a popover that must close)
          fillPickerField('Department', f.department, function() {
            fillPickerField('Type', f.type, function() {
              // Fill simple text fields
              fillTextField('Location', f.location);
              fillTextField('Summary (for card listing)', f.summary);

              // Fill the body (Slate MDX editor via paste simulation)
              if (data.markdown) {
                fillBodyEditor(data.markdown);
              }
              showStatus(status, 'success', 'All fields filled from "' + file.name + '".');
            });
          });
        })
        .catch(function(err) {
          extractBtn.disabled = false;
          showStatus(status, 'error', 'Upload failed: ' + err.message);
        });
    });

    return true;
  }

  function showStatus(el, type, msg) {
    el.className = 'ks-pdf-status ' + type;
    el.textContent = msg;
  }

  // Wait for Keystatic to render, then inject
  var ready = false;
  function trySetup() { if (!ready && setup()) ready = true; }
  trySetup();
  var obs = new MutationObserver(trySetup);
  obs.observe(document.body, { childList: true, subtree: true });
  var cleanup = setInterval(function() {
    if (ready) { obs.disconnect(); clearInterval(cleanup); }
  }, 3000);
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
