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

    // Fetch PR to validate it's from a content/ branch and same repo
    const prRes = await fetch(`https://api.github.com/repos/${REPO}/pulls/${prNumber}`, { headers });
    if (!prRes.ok) return json({ error: `PR #${prNumber} not found` }, 404);

    const pr = await prRes.json();

    if (!pr.head.ref.startsWith('content/'))
      return json({ error: 'Only content/ branches can be merged from this dashboard' }, 403);
    if (pr.head.repo?.full_name !== pr.base.repo?.full_name)
      return json({ error: 'Cannot merge PRs from forks' }, 403);
    if (pr.state !== 'open')
      return json({ error: 'PR is not open' }, 409);

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
      const mergeErr = await mergeRes.json().catch(() => ({}));
      return json({ error: (mergeErr as any).message || 'Merge failed' }, mergeRes.status);
    }

    // Delete branch after merge
    await fetch(`https://api.github.com/repos/${REPO}/git/refs/heads/${pr.head.ref}`, {
      method: 'DELETE',
      headers,
    }).catch(() => {});

    return json({ ok: true, merged: prNumber });
  } catch (e: any) {
    return json({ error: e.message || 'Internal server error' }, 500);
  }
};
