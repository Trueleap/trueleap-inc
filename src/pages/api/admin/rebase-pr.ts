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

    let body: { prNumber?: number };
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const prNumber = body.prNumber;
    if (!prNumber || typeof prNumber !== 'number') {
      return json({ error: 'prNumber is required' }, 400);
    }

    const headers = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'TrueLeap-Admin',
    };

    // Fetch PR to validate
    const prRes = await fetch(`https://api.github.com/repos/${REPO}/pulls/${prNumber}`, { headers });
    if (!prRes.ok) return json({ error: `PR #${prNumber} not found` }, 404);

    const pr = await prRes.json();

    if (!pr.head.ref.startsWith('content/'))
      return json({ error: 'Only content/ branches can be rebased' }, 403);

    // Update branch with latest main using GitHub's update-branch API
    const updateRes = await fetch(`https://api.github.com/repos/${REPO}/pulls/${prNumber}/update-branch`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ expected_head_sha: pr.head.sha }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.json().catch(() => ({}));
      return json({ error: (err as any).message || 'Update branch failed' }, updateRes.status);
    }

    return json({ ok: true, updated: prNumber });
  } catch (e: any) {
    return json({ error: e.message || 'Internal server error' }, 500);
  }
};
