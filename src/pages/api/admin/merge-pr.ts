import type { APIRoute } from 'astro';

export const prerender = false;

const REPO = 'Trueleap/trueleap-inc';

export const POST: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as any).runtime;
  const GITHUB_TOKEN = runtime?.env?.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    return new Response(JSON.stringify({ error: 'GITHUB_TOKEN not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { prNumber?: number };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const prNumber = body.prNumber;
  if (!prNumber || typeof prNumber !== 'number') {
    return new Response(JSON.stringify({ error: 'prNumber is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'TrueLeap-Admin',
  };

  // Fetch PR to validate it's from a content/ branch and same repo
  const prRes = await fetch(`https://api.github.com/repos/${REPO}/pulls/${prNumber}`, { headers });
  if (!prRes.ok) {
    return new Response(JSON.stringify({ error: `PR #${prNumber} not found` }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const pr = await prRes.json();

  if (!pr.head.ref.startsWith('content/')) {
    return new Response(JSON.stringify({ error: 'Only content/ branches can be merged from this dashboard' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (pr.head.repo?.full_name !== pr.base.repo?.full_name) {
    return new Response(JSON.stringify({ error: 'Cannot merge PRs from forks' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (pr.state !== 'open') {
    return new Response(JSON.stringify({ error: 'PR is not open' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Merge with squash
  const mergeRes = await fetch(`https://api.github.com/repos/${REPO}/pulls/${prNumber}/merge`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merge_method: 'squash',
      commit_title: `Content: ${pr.title}`,
    }),
  });

  if (!mergeRes.ok) {
    const mergeErr = await mergeRes.json();
    return new Response(JSON.stringify({ error: mergeErr.message || 'Merge failed' }), {
      status: mergeRes.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Delete branch after merge
  await fetch(`https://api.github.com/repos/${REPO}/git/refs/heads/${pr.head.ref}`, {
    method: 'DELETE',
    headers,
  });

  return new Response(JSON.stringify({ ok: true, merged: prNumber }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
