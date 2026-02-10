import { NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? ''
const GITHUB_REPO = process.env.GITHUB_REPO ?? 'Trueleap/trueleap-inc'

export async function GET() {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ status: 'unknown', error: 'GITHUB_TOKEN not configured' })
  }

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/actions/runs?per_page=1`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  )

  if (!res.ok) {
    return NextResponse.json({ status: 'unknown' })
  }

  const data = await res.json()
  const run = data.workflow_runs?.[0]

  if (!run) {
    return NextResponse.json({ status: 'unknown' })
  }

  return NextResponse.json({
    status: run.status === 'completed' ? run.conclusion : run.status,
    url: run.html_url,
    created_at: run.created_at,
    updated_at: run.updated_at,
  })
}
