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
  };

  // Fetch PR to validate
  const prRes = await fetch(`https://api.github.com/repos/${REPO}/pulls/${prNumber}`, { headers });
  if (!prRes.ok) {
    return new Response(JSON.stringify({ error: `PR #${prNumber} not found` }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const pr = await prRes.json();

  if (!pr.head.ref.startsWith('content/')) {
    return new Response(JSON.stringify({ error: 'Only content/ branches can be rebased' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Update branch with latest main using GitHub's update-branch API
  const updateRes = await fetch(`https://api.github.com/repos/${REPO}/pulls/${prNumber}/update-branch`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ expected_head_sha: pr.head.sha }),
  });

  if (!updateRes.ok) {
    const err = await updateRes.json();
    return new Response(JSON.stringify({ error: err.message || 'Update branch failed' }), {
      status: updateRes.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, updated: prNumber }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
