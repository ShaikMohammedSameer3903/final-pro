import { useMemo, useRef, useState, useEffect } from 'react'
import mammoth from 'mammoth'
import { jsPDF } from 'jspdf'
import Button from '../components/Button.jsx'

export default function DocxToPdf() {
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [html, setHtml] = useState('')
  const previewRef = useRef(null)

  const filenameBase = useMemo(() => (file?.name ? file.name.replace(/\.[^.]+$/, '') : 'document'), [file])

  const renderDoc = async () => {
    if (!file) return
    setBusy(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      setHtml(result.value || '')
    } finally {
      setBusy(false)
    }
  }

  const exportPdf = async () => {
    if (!previewRef.current) return
    
    // Create a new jsPDF instance
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })
    
    // Add the HTML content to the PDF
    await doc.html(previewRef.current, {
      callback: function(doc) {
        // Save the PDF
        doc.save(`${filenameBase}.pdf`)
      },
      x: 10,
      y: 10,
      width: 190, // A4 width in mm - 2*10mm margins
      windowWidth: previewRef.current.scrollWidth,
    })
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div className="h1" style={{ fontSize: 28 }}>DOCX → PDF</div>
          <p className="p">Render DOCX in the browser and export to PDF. No server storage.</p>
        </div>
        <span className="badge">Frontend only</span>
      </div>

      <div className="split">
        <div className="card">
          <div className="section">
            <label className="label">Upload DOCX</label>
            <input
              className="input"
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null)
                setHtml('')
              }}
            />

            <div style={{ height: 12 }} />

            <div className="row">
              <Button onClick={renderDoc} disabled={!file || busy}>{busy ? 'Rendering…' : 'Render Preview'}</Button>
              <Button variant="secondary" onClick={exportPdf} disabled={!html}>Export PDF</Button>
            </div>

            <div style={{ height: 12 }} />

            <div className="muted">
              Interview note: document rendering is client-side only, files are not uploaded or stored on any server.
            </div>
          </div>
        </div>

        <div className="card sticky">
          <div className="section">
            <div className="h2" style={{ margin: 0 }}>Preview</div>
            <div style={{ height: 10 }} />
            <div
              ref={previewRef}
              style={{
                background: 'white',
                color: '#111',
                borderRadius: 12,
                padding: 16,
                minHeight: 200,
                overflow: 'hidden',
              }}
            >
              {html ? (
                <div dangerouslySetInnerHTML={{ __html: html }} />
              ) : (
                <div style={{ color: '#444' }}>Upload a DOCX and click “Render Preview”.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
