import type { APIRoute } from 'astro';

export const prerender = false;

const REPO = 'Trueleap/trueleap-inc';

const json = (data: object, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

/**
 * Check the deploy-preview workflow status for a branch.
 * GET /api/admin/preview-status?branch=content/sandip
 *
 * Returns: { status: 'pending' | 'deploying' | 'ready' | 'failed' | 'none' }
 *  - none: no workflow run found (PR not yet created or workflow not triggered)
 *  - pending: workflow queued
 *  - deploying: workflow in progress
 *  - ready: workflow completed successfully
 *  - failed: workflow failed
 */
export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const runtime = (locals as any).runtime;
    const GITHUB_TOKEN = runtime?.env?.GITHUB_TOKEN;
    if (!GITHUB_TOKEN) return json({ error: 'GITHUB_TOKEN not configured' }, 500);

    const branch = url.searchParams.get('branch');
    if (!branch || !branch.startsWith('content/')) {
      return json({ error: 'branch query param required (content/...)' }, 400);
    }

    const headers = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'TrueLeap-Admin',
    };

    // Check the latest workflow run for deploy-preview.yml on this branch
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/actions/workflows/deploy-preview.yml/runs?branch=${encodeURIComponent(branch)}&per_page=1`,
      { headers },
    );

    if (!res.ok) {
      // Workflow file might not exist or API error — treat as no runs
      return json({ status: 'none' });
    }

    const data = await res.json();
    const runs = data.workflow_runs || [];

    if (runs.length === 0) {
      return json({ status: 'none' });
    }

    const run = runs[0];

    if (run.status === 'completed') {
      return json({
        status: run.conclusion === 'success' ? 'ready' : 'failed',
        conclusion: run.conclusion,
        updated_at: run.updated_at,
      });
    }

    if (run.status === 'in_progress') {
      return json({ status: 'deploying', started_at: run.run_started_at });
    }

    // queued, waiting, requested, pending
    return json({ status: 'pending' });
  } catch (e: any) {
    return json({ error: e.message || 'Internal server error' }, 500);
  }
};
