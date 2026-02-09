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

  let body: { branch?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const branch = body.branch?.trim();
  if (!branch) {
    return new Response(JSON.stringify({ error: 'branch is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!branch.startsWith('content/')) {
    return new Response(JSON.stringify({ error: 'Only content/ branches can be deleted' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (branch === 'main') {
    return new Response(JSON.stringify({ error: 'Cannot delete main branch' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'TrueLeap-Admin',
  };

  // Check for open PRs on this branch
  const prsRes = await fetch(
    `https://api.github.com/repos/${REPO}/pulls?state=open&head=Trueleap:${branch}&per_page=1`,
    { headers }
  );
  if (prsRes.ok) {
    const prs = await prsRes.json();
    if (prs.length > 0) {
      return new Response(JSON.stringify({ error: `Branch has open PR #${prs[0].number}. Merge or close it first.` }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Delete the branch ref
  const deleteRes = await fetch(`https://api.github.com/repos/${REPO}/git/refs/heads/${branch}`, {
    method: 'DELETE',
    headers,
  });

  if (!deleteRes.ok) {
    const err = await deleteRes.json().catch(() => ({}));
    return new Response(JSON.stringify({ error: (err as any).message || 'Failed to delete branch' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, deleted: branch }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
