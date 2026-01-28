import { useMemo, useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import Button from '../components/Button.jsx'

async function fileToArrayBuffer(file) {
  return await file.arrayBuffer()
}

async function fileToImageBitmap(file) {
  const blob = new Blob([await file.arrayBuffer()], { type: file.type })
  return await createImageBitmap(blob)
}

function downloadBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ImagesToPdf() {
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)

  const total = useMemo(() => files.reduce((sum, f) => sum + f.size, 0), [files])

  const makePdf = async () => {
    if (!files.length) return
    setBusy(true)
    try {
      const pdf = await PDFDocument.create()

      for (const file of files) {
        const bytes = await fileToArrayBuffer(file)
        const isPng = file.type === 'image/png'
        const isJpg = file.type === 'image/jpeg' || file.type === 'image/jpg'

        let img
        if (isPng) img = await pdf.embedPng(bytes)
        else if (isJpg) img = await pdf.embedJpg(bytes)
        else {
          const bmp = await fileToImageBitmap(file)
          const canvas = document.createElement('canvas')
          canvas.width = bmp.width
          canvas.height = bmp.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(bmp, 0, 0)
          const jpegBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
          const jpegBytes = await jpegBlob.arrayBuffer()
          img = await pdf.embedJpg(jpegBytes)
        }

        const page = pdf.addPage([img.width, img.height])
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
      }

      const out = await pdf.save()
      downloadBytes(out, 'images.pdf')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div className="h1" style={{ fontSize: 28 }}>Images → PDF</div>
          <p className="p">Combine multiple images into one PDF. Everything stays on your device.</p>
        </div>
        <span className="badge">Frontend only</span>
      </div>

      <div className="card">
        <div className="section">
          <label className="label">Select images</label>
          <input
            className="input"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />

          <div style={{ height: 12 }} />

          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className="muted">{files.length} file(s) • {(total / 1024 / 1024).toFixed(2)} MB</div>
            <Button onClick={makePdf} disabled={!files.length || busy}>{busy ? 'Building…' : 'Download PDF'}</Button>
          </div>

          <div style={{ height: 12 }} />

          <div className="grid cols-3">
            {files.map((f) => (
              <div key={f.name} className="card" style={{ boxShadow: 'none' }}>
                <div className="section" style={{ padding: 12 }}>
                  <div style={{ fontWeight: 800, marginBottom: 6, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                  <img
                    src={URL.createObjectURL(f)}
                    alt={f.name}
                    style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}
                    onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
