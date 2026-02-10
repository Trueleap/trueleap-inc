'use client'
import React, { useCallback, useState } from 'react'
import { useField, useAllFormFields } from '@payloadcms/ui'

type Status = 'idle' | 'extracting' | 'success' | 'error'

const ExtractPdfButton: React.FC = () => {
  const { value: sourcePdfValue } = useField<number | null>({ path: 'sourcePdf' })
  const titleField = useField<string>({ path: 'title' })
  const departmentField = useField<string>({ path: 'department' })
  const locationField = useField<string>({ path: 'location' })
  const typeField = useField<string>({ path: 'type' })
  const summaryField = useField<string>({ path: 'summary' })
  const [, dispatchFields] = useAllFormFields()

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

      if (fields.title) titleField.setValue(fields.title)
      if (fields.department) departmentField.setValue(fields.department)
      if (fields.location) locationField.setValue(fields.location)
      if (fields.type) typeField.setValue(fields.type)
      if (fields.summary) summaryField.setValue(fields.summary)

      // Lexical richText fields need dispatchFields to trigger editor re-mount
      if (lexicalBody) {
        dispatchFields({
          type: 'UPDATE',
          path: 'body',
          value: lexicalBody,
          initialValue: lexicalBody,
          valid: true,
        })
      }

      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Extraction failed')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }, [mediaId, titleField, departmentField, locationField, typeField, summaryField, dispatchFields])

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
        <span className="extract-pdf__msg extract-pdf__msg--success">Fields populated</span>
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
