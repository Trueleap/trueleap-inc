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

  let body: { name?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = body.name?.trim();
  if (!name) {
    return new Response(JSON.stringify({ error: 'name is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(name) || name.length > 60) {
    return new Response(JSON.stringify({ error: 'Name must be 1-60 chars, alphanumeric with hyphens/underscores only' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const branch = `content/${name}`;
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'TrueLeap-Admin',
  };

  // Get main branch HEAD SHA
  const mainRes = await fetch(`https://api.github.com/repos/${REPO}/git/ref/heads/main`, { headers });
  if (!mainRes.ok) {
    return new Response(JSON.stringify({ error: 'Could not fetch main branch' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const mainData = await mainRes.json();
  const sha = mainData.object.sha;

  // Create the branch ref
  const createRes = await fetch(`https://api.github.com/repos/${REPO}/git/refs`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha }),
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    const status = createRes.status === 422 ? 409 : 502;
    return new Response(JSON.stringify({ error: err.message || 'Failed to create branch' }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const keystaticlUrl = `/keystatic/branch/${branch.replace(/\//g, '~2F')}`;

  return new Response(JSON.stringify({ ok: true, branch, keystaticlUrl }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
