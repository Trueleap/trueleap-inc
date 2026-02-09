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

    let body: { branch?: string };
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const branch = body.branch?.trim();
    if (!branch || !branch.startsWith('content/')) {
      return json({ error: 'Must be a content/ branch' }, 400);
    }

    const headers = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'TrueLeap-Admin',
    };

    // Check no open PR already exists for this branch
    const existingRes = await fetch(
      `https://api.github.com/repos/${REPO}/pulls?state=open&head=Trueleap:${branch}`,
      { headers },
    );
    if (existingRes.ok) {
      const existing = await existingRes.json();
      if (existing.length > 0) {
        return json({ error: `PR #${existing[0].number} already exists for this branch` }, 409);
      }
    }

    const shortName = branch.replace('content/', '');
    const title = `Content: ${shortName}`;

    const createRes = await fetch(`https://api.github.com/repos/${REPO}/pulls`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        head: branch,
        base: 'main',
        body: `Content update from branch \`${branch}\`.`,
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      return json({ error: (err as any).message || 'Failed to create PR' }, 502);
    }

    const pr = await createRes.json();

    // Trigger deploy-preview workflow as a safety net
    // (the pull_request.opened event sometimes doesn't fire)
    fetch(`https://api.github.com/repos/${REPO}/actions/workflows/deploy-preview.yml/dispatches`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref: branch, inputs: { branch } }),
    }).catch(() => {});

    return json({ ok: true, prNumber: pr.number }, 201);
  } catch (e: any) {
    return json({ error: e.message || 'Internal server error' }, 500);
  }
};
