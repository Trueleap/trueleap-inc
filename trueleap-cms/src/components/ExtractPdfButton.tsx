'use client'
import React, { useCallback, useState } from 'react'
import { useField, useDocumentInfo } from '@payloadcms/ui'
import { useRouter } from 'next/navigation.js'

type Status = 'idle' | 'extracting' | 'success' | 'error'

const ExtractPdfButton: React.FC = () => {
  const { value: sourcePdfValue } = useField<number | null>({ path: 'sourcePdf' })
  const titleField = useField<string>({ path: 'title' })
  const locationField = useField<string>({ path: 'location' })
  const summaryField = useField<string>({ path: 'summary' })
  const docInfo = useDocumentInfo()
  const router = useRouter()

  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const hasExistingValues = Boolean(
    titleField.value || locationField.value || summaryField.value,
  )

  const mediaId =
    typeof sourcePdfValue === 'object' && sourcePdfValue !== null
      ? (sourcePdfValue as any).id ?? sourcePdfValue
      : sourcePdfValue

  const doExtract = useCallback(async () => {
    if (!mediaId) return
    setStatus('extracting')
    setErrorMsg('')
    setShowConfirm(false)

    try {
      // 1. Extract fields + Lexical body from PDF
      const res = await fetch('/api/extract-job-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mediaId }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`)
      }

      const { fields, lexicalBody } = data

      // 2. Build patch payload — only include non-empty extracted fields
      const patch: Record<string, unknown> = {}
      if (fields.title) patch.title = fields.title
      if (fields.department) patch.department = fields.department
      if (fields.location) patch.location = fields.location
      if (fields.type) patch.type = fields.type
      if (fields.summary) patch.summary = fields.summary
      if (lexicalBody) patch.body = lexicalBody

      // 3. Save via Payload REST API
      //    If doc already exists (has ID), PATCH it. Otherwise, create it.
      const docId = docInfo?.id
      const isNew = !docId

      // For new docs, also include the sourcePdf so we don't lose it
      if (isNew) {
        patch.sourcePdf = mediaId
      }

      const saveRes = await fetch(
        isNew ? '/api/jobs' : `/api/jobs/${docId}`,
        {
          method: isNew ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(patch),
        },
      )

      const saveData = await saveRes.json()
      if (!saveRes.ok) {
        throw new Error(saveData.errors?.[0]?.message || `Save failed: HTTP ${saveRes.status}`)
      }

      // 4. Navigate to the saved document — editor will mount fresh with proper nodes
      const savedId = saveData.doc?.id || docId
      router.push(`/admin/collections/jobs/${savedId}`)
      // Force a full reload so the Lexical editor initializes from server state
      router.refresh()

      setStatus('success')
    } catch (err: any) {
      setErrorMsg(err.message || 'Extraction failed')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }, [mediaId, docInfo?.id, router])

  const handleClick = useCallback(() => {
    if (hasExistingValues) {
      setShowConfirm(true)
    } else {
      doExtract()
    }
  }, [hasExistingValues, doExtract])

  if (!mediaId) return null

  return (
    <div className="extract-pdf">
      <button
        type="button"
        className="extract-pdf__btn"
        disabled={status === 'extracting'}
        onClick={handleClick}
      >
        {status === 'extracting' && <span className="extract-pdf__spinner" />}
        {status === 'extracting' ? 'Extracting...' : 'Extract from PDF'}
      </button>

      {status === 'success' && (
        <span className="extract-pdf__msg extract-pdf__msg--success">Saved — reloading...</span>
      )}
      {status === 'error' && (
        <span className="extract-pdf__msg extract-pdf__msg--error">{errorMsg}</span>
      )}

      {showConfirm && (
        <div className="publish-modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="publish-modal publish-modal--confirm" onClick={(e) => e.stopPropagation()}>
            <div className="publish-modal__header">
              <h2>Overwrite existing fields?</h2>
              <button
                type="button"
                className="publish-modal__close"
                onClick={() => setShowConfirm(false)}
              >
                &times;
              </button>
            </div>
            <div className="publish-modal__body">
              Some fields already have values. Extracting from the PDF will overwrite them.
            </div>
            <div className="publish-modal__footer">
              <button
                type="button"
                className="publish-modal__cancel"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button type="button" className="publish-modal__publish" onClick={doExtract}>
                Overwrite &amp; Extract
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExtractPdfButton
