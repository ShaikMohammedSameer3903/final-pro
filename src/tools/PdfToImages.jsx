import { useState } from 'react'
import Button from '../components/Button.jsx'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function PdfToImages() {
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [images, setImages] = useState([])

  const convert = async () => {
    if (!file) return
    setBusy(true)
    setImages([])

    try {
      const bytes = new Uint8Array(await file.arrayBuffer())
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise
      const out = []

      for (let i = 1; i <= pdf.numPages; i += 1) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 2 })
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({ canvasContext: ctx, viewport }).promise

        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
        out.push({ page: i, blob })
      }

      setImages(out)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div className="h1" style={{ fontSize: 28 }}>PDF → Images</div>
          <p className="p">Convert each PDF page into a PNG image in the browser.</p>
        </div>
        <span className="badge">Frontend only</span>
      </div>

      <div className="card">
        <div className="section">
          <label className="label">Upload PDF</label>
          <input
            className="input"
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null)
              setImages([])
            }}
          />

          <div style={{ height: 12 }} />

          <div className="row">
            <Button onClick={convert} disabled={!file || busy}>{busy ? 'Converting…' : 'Convert'}</Button>
          </div>

          <div style={{ height: 12 }} />

          {images.length ? (
            <div className="grid cols-3">
              {images.map((it) => (
                <div key={it.page} className="card" style={{ boxShadow: 'none' }}>
                  <div className="section" style={{ padding: 12 }}>
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 800 }}>Page {it.page}</div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadBlob(it.blob, `page_${it.page}.png`)}
                      >
                        Download
                      </Button>
                    </div>
                    <div style={{ height: 10 }} />
                    <img
                      src={URL.createObjectURL(it.blob)}
                      alt={`Page ${it.page}`}
                      style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}
                      onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="muted">No pages converted yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
