'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface DraftItem {
  type: 'global' | 'collection'
  slug: string
  label: string
  id?: number
  title?: string
}

interface DeployRun {
  id: number
  status: string
  created_at: string
  url: string
}

type DeployStatus = 'idle' | 'deploying' | 'success' | 'failure'
type PublishPhase = 'idle' | 'publishing' | 'deploying'

const GLOBAL_LABELS: Record<string, string> = {
  homepage: 'Homepage',
  'company-overview': 'Company Overview',
  'mission-page': 'Mission & Vision',
  'careers-page': 'Careers Page',
  'platform-overview': 'Platform Overview',
  'infrastructure-page': 'Infrastructure Page',
  'digital-systems-page': 'Digital Systems Page',
  'edge-ai-page': 'Edge AI Page',
  'stack-page': 'Stack Page',
  'solutions-overview': 'Solutions Overview',
  'impact-overview': 'Impact Overview',
  'case-studies-page': 'Case Studies Page',
  'metrics-page': 'Metrics Page',
  'network-map-page': 'Network Map Page',
  'trust-center-page': 'Trust Center Page',
  'newsroom-page': 'Newsroom Page',
  'docs-page': 'Documentation Page',
  'last-mile-page': 'Last Mile Page',
  'resources-overview': 'Resources Overview',
  'privacy-page': 'Privacy Policy',
  'terms-page': 'Terms of Service',
}

const GLOBAL_SLUGS = Object.keys(GLOBAL_LABELS)

const COLLECTION_SLUGS = [
  'case-studies',
  'news',
  'team',
  'partners',
  'jobs',
  'testimonials',
  'industry-solutions',
  'outcome-solutions',
]

const DraftBanner: React.FC = () => {
  const [drafts, setDrafts] = useState<DraftItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [publishPhase, setPublishPhase] = useState<PublishPhase>('idle')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deployStatus, setDeployStatus] = useState<DeployStatus>('idle')
  const [deployHistory, setDeployHistory] = useState<DeployRun[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)

  const fetchDrafts = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    const items: DraftItem[] = []

    await Promise.all(
      GLOBAL_SLUGS.map(async (slug) => {
        try {
          const res = await fetch(`/api/globals/${slug}?depth=0&draft=true`)
          if (!res.ok) return
          const data = await res.json()
          if (data._status === 'draft') {
            items.push({ type: 'global', slug, label: GLOBAL_LABELS[slug] || slug })
          }
        } catch {}
      }),
    )

    await Promise.all(
      COLLECTION_SLUGS.map(async (slug) => {
        try {
          const res = await fetch(
            `/api/${slug}?depth=0&limit=100&where[_status][equals]=draft`,
          )
          if (!res.ok) return
          const data = await res.json()
          for (const doc of data.docs || []) {
            items.push({
              type: 'collection',
              slug,
              id: doc.id,
              label: slug,
              title: doc.title || doc.name || doc.attribution || `#${doc.id}`,
            })
          }
        } catch {}
      }),
    )

    setDrafts(items)
    setSelected(new Set(items.map((d) => itemKey(d))))
    setLoading(false)
  }, [])

  // Fetch drafts on mount + poll every 30s to stay in sync
  useEffect(() => {
    fetchDrafts()
    const interval = setInterval(() => fetchDrafts(true), 30_000)
    return () => clearInterval(interval)
  }, [fetchDrafts])

  // Always poll deploy status to show when any deployment is in progress
  useEffect(() => {
    const checkDeployStatus = async () => {
      try {
        const res = await fetch('/api/deploy/status')
        const data = await res.json()
        if (data.status === 'queued' || data.status === 'in_progress') {
          setDeployStatus('deploying')
        } else if (data.status === 'success') {
          setDeployStatus((prev) => {
            if (prev === 'deploying') {
              fetchDrafts(true)
              setTimeout(() => setDeployStatus('idle'), 5000)
              return 'success'
            }
            return prev
          })
        } else if (data.status === 'failure') {
          setDeployStatus((prev) => {
            if (prev === 'deploying') {
              setTimeout(() => setDeployStatus('idle'), 8000)
              return 'failure'
            }
            return prev
          })
        } else {
          // completed/cancelled/unknown — no active deploy
          setDeployStatus((prev) => (prev === 'deploying' ? 'idle' : prev))
        }
      } catch {}
    }

    checkDeployStatus()
    const poll = setInterval(checkDeployStatus, 10_000)
    return () => clearInterval(poll)
  }, [fetchDrafts])

  const itemKey = (d: DraftItem) =>
    d.type === 'global' ? `global:${d.slug}` : `collection:${d.slug}:${d.id}`

  const itemEditUrl = (d: DraftItem) =>
    d.type === 'global'
      ? `/admin/globals/${d.slug}`
      : `/admin/collections/${d.slug}/${d.id}`

  const toggleItem = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === drafts.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(drafts.map((d) => itemKey(d))))
    }
  }

  const fetchDeployHistory = useCallback(async () => {
    setHistoryLoading(true)
    try {
      const res = await fetch('/api/deploy/history')
      const data = await res.json()
      setDeployHistory(data.runs ?? [])
    } catch {
      setDeployHistory([])
    }
    setHistoryLoading(false)
  }, [])

  const openHistory = useCallback(() => {
    setShowHistory(true)
    fetchDeployHistory()
  }, [fetchDeployHistory])

  const triggerDeploy = async () => {
    try {
      const res = await fetch('/api/deploy/trigger', { method: 'POST' })
      if (res.ok) {
        setDeployStatus('deploying')
      } else {
        setDeployStatus('failure')
        setTimeout(() => setDeployStatus('idle'), 5000)
      }
    } catch {
      setDeployStatus('failure')
      setTimeout(() => setDeployStatus('idle'), 5000)
    }
  }

  // Step 1: Show confirmation dialog
  const handlePublishClick = () => {
    setShowModal(false)
    setShowConfirm(true)
  }

  // Step 2: Actually publish + deploy after confirmation
  const confirmPublishAndDeploy = async () => {
    setPublishPhase('publishing')
    const toPublish = drafts.filter((d) => selected.has(itemKey(d)))
    let successCount = 0

    for (const item of toPublish) {
      try {
        let res: Response
        if (item.type === 'global') {
          res = await fetch(`/api/globals/${item.slug}?publishAllLocales=true`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _status: 'published' }),
          })
        } else {
          res = await fetch(`/api/${item.slug}/${item.id}?publishAllLocales=true`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _status: 'published' }),
          })
        }
        if (res.ok) successCount++
        else console.error(`Failed to publish ${itemKey(item)}: HTTP ${res.status}`)
      } catch (e) {
        console.error(`Failed to publish ${itemKey(item)}:`, e)
      }
    }

    // Small delay to let D1 writes propagate before re-querying
    await new Promise((r) => setTimeout(r, 500))
    await fetchDrafts()

    if (successCount > 0) {
      setPublishPhase('deploying')
      await triggerDeploy()
    }

    setPublishPhase('idle')
    setShowConfirm(false)
  }

  if (loading) return null

  const selectedCount = selected.size

  const deployIndicator = () => {
    if (deployStatus === 'idle') return null

    if (deployStatus === 'deploying')
      return (
        <button type="button" className="deploy-banner deploy-banner--building deploy-banner--clickable" onClick={openHistory}>
          <span className="deploy-banner__dot" />
          Deploying...
        </button>
      )
    if (deployStatus === 'success')
      return (
        <button type="button" className="deploy-banner deploy-banner--success deploy-banner--clickable" onClick={openHistory}>
          Deployed
        </button>
      )
    if (deployStatus === 'failure')
      return (
        <button type="button" className="deploy-banner deploy-banner--failure deploy-banner--clickable" onClick={openHistory}>
          Deploy failed
        </button>
      )
    return null
  }

  return (
    <>
      {deployIndicator()}

      {drafts.length === 0 ? (
        <>
          <span className="draft-banner draft-banner--published">All published</span>
          {deployStatus === 'idle' && (
            <button
              type="button"
              className="deploy-banner deploy-banner--manual deploy-banner--clickable"
              onClick={triggerDeploy}
            >
              Deploy
            </button>
          )}
        </>
      ) : (
        <button
          className="draft-banner draft-banner--drafts"
          onClick={() => setShowModal(true)}
          type="button"
        >
          <span className="draft-banner__dot" />
          <span className="draft-banner__text">{drafts.length} unpublished</span>
        </button>
      )}

      {/* ── Publish modal (portaled to body to escape header overflow) ── */}
      {showModal && createPortal(
        <div className="publish-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="publish-modal" onClick={(e) => e.stopPropagation()}>
            <div className="publish-modal__header">
              <h2>Unpublished Changes</h2>
              <button
                type="button"
                className="publish-modal__close"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="publish-modal__controls">
              <label className="publish-modal__select-all">
                <input
                  type="checkbox"
                  checked={selectedCount === drafts.length}
                  onChange={toggleAll}
                />
                Select all ({drafts.length})
              </label>
            </div>

            <div className="publish-modal__list">
              {drafts.map((item) => {
                const key = itemKey(item)
                return (
                  <div key={key} className="publish-modal__item">
                    <input
                      type="checkbox"
                      checked={selected.has(key)}
                      onChange={() => toggleItem(key)}
                    />
                    <a
                      className="publish-modal__item-info"
                      href={itemEditUrl(item)}
                      onClick={() => setShowModal(false)}
                    >
                      <span className="publish-modal__item-type">
                        {item.type === 'global' ? 'Page' : item.slug}
                      </span>
                      <span className="publish-modal__item-title">
                        {item.type === 'global' ? item.label : item.title}
                      </span>
                    </a>
                  </div>
                )
              })}
            </div>

            <div className="publish-modal__footer">
              <button
                type="button"
                className="publish-modal__cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="publish-modal__publish"
                disabled={selectedCount === 0}
                onClick={handlePublishClick}
              >
                {`Publish ${selectedCount} item${selectedCount !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* ── Publish & deploy confirmation dialog (portaled to body) ── */}
      {showConfirm && createPortal(
        <div className="publish-modal-overlay" onClick={() => { if (publishPhase === 'idle') { setShowConfirm(false); setShowModal(true) } }}>
          <div
            className="publish-modal publish-modal--confirm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="publish-modal__header">
              <h2>{publishPhase === 'publishing' ? 'Publishing...' : publishPhase === 'deploying' ? 'Triggering Deploy...' : 'Publish & Deploy?'}</h2>
              <button
                type="button"
                className="publish-modal__close"
                disabled={publishPhase !== 'idle'}
                onClick={() => { setShowConfirm(false); setShowModal(true) }}
              >
                &times;
              </button>
            </div>

            <div className="publish-modal__body">
              This will publish <strong>{selectedCount} item{selectedCount !== 1 ? 's' : ''}</strong> and
              trigger a site rebuild. The live site will update in ~2&#x2011;3 minutes.
            </div>

            <div className="publish-modal__footer">
              <button
                type="button"
                className="publish-modal__cancel"
                disabled={publishPhase !== 'idle'}
                onClick={() => { setShowConfirm(false); setShowModal(true) }}
              >
                {publishPhase !== 'idle' ? 'Please wait...' : 'Back'}
              </button>
              <button
                type="button"
                className="publish-modal__publish"
                disabled={publishPhase !== 'idle'}
                onClick={confirmPublishAndDeploy}
              >
                {publishPhase === 'publishing'
                  ? 'Publishing...'
                  : publishPhase === 'deploying'
                    ? 'Triggering deploy...'
                    : 'Publish & Deploy'}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* ── Deploy history dialog (portaled to body) ── */}
      {showHistory && createPortal(
        <div className="publish-modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="publish-modal" onClick={(e) => e.stopPropagation()}>
            <div className="publish-modal__header">
              <h2>Publish Deployments</h2>
              <button
                type="button"
                className="publish-modal__close"
                onClick={() => setShowHistory(false)}
              >
                &times;
              </button>
            </div>

            <div className="publish-modal__list">
              {historyLoading && (
                <div className="deploy-history__loading">Loading...</div>
              )}
              {!historyLoading && deployHistory.length === 0 && (
                <div className="deploy-history__empty">No publish deployments yet</div>
              )}
              {deployHistory.map((run) => (
                <a
                  key={run.id}
                  className="deploy-history__row"
                  href={run.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={`deploy-history__status deploy-history__status--${run.status}`}>
                    {run.status === 'success' ? '\u2713' : run.status === 'failure' ? '\u2717' : run.status === 'in_progress' || run.status === 'queued' ? '\u25CB' : '\u2014'}
                  </span>
                  <span className="deploy-history__info">
                    <span className="deploy-history__label">
                      {run.status === 'success' ? 'Deployed' : run.status === 'failure' ? 'Failed' : run.status === 'in_progress' ? 'Deploying' : run.status === 'queued' ? 'Queued' : run.status}
                    </span>
                    <span className="deploy-history__time">
                      {new Date(run.created_at).toLocaleString()}
                    </span>
                  </span>
                </a>
              ))}
            </div>

            <div className="publish-modal__footer">
              <button
                type="button"
                className="publish-modal__cancel"
                onClick={() => setShowHistory(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}

export default DraftBanner
