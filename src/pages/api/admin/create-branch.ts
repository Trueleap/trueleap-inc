import type { APIRoute } from 'astro';

export const prerender = false;

const REPO = 'Trueleap/trueleap-inc';

const json = (data: object, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const runtime = (locals as any).runtime;
    const GITHUB_TOKEN = runtime?.env?.GITHUB_TOKEN;
    if (!GITHUB_TOKEN) return json({ error: 'GITHUB_TOKEN not configured' }, 500);

    let body: { name?: string };
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const name = body.name?.trim();
    if (!name) return json({ error: 'name is required' }, 400);

    if (!/^[a-zA-Z0-9_-]+$/.test(name) || name.length > 60) {
      return json({ error: 'Name must be 1-60 chars, alphanumeric with hyphens/underscores only' }, 400);
    }

    const branch = `content/${name}`;
    const headers = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'TrueLeap-Admin',
    };

    // Get main branch HEAD SHA
    const mainRes = await fetch(`https://api.github.com/repos/${REPO}/git/ref/heads/main`, { headers });
    if (!mainRes.ok) return json({ error: 'Could not fetch main branch' }, 502);

    const mainData = await mainRes.json();
    const sha = mainData.object.sha;

    // Create the branch ref
    const createRes = await fetch(`https://api.github.com/repos/${REPO}/git/refs`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha }),
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      const status = createRes.status === 422 ? 409 : 502;
      return json({ error: (err as any).message || 'Failed to create branch' }, status);
    }

    const keystaticlUrl = `/keystatic/branch/${branch.replace(/\//g, '%2F')}`;
    return json({ ok: true, branch, keystaticlUrl }, 201);
  } catch (e: any) {
    return json({ error: e.message || 'Internal server error' }, 500);
  }
};
