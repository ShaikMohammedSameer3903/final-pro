import { useMemo, useState } from 'react'
import Button from '../components/Button.jsx'

async function fileToImage(file) {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = reject
      el.src = url
    })
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ImageConverter() {
  const [file, setFile] = useState(null)
  const [format, setFormat] = useState('image/png')
  const [quality, setQuality] = useState(0.92)
  const [busy, setBusy] = useState(false)
  const [outBlob, setOutBlob] = useState(null)

  const outExt = useMemo(() => {
    if (format === 'image/png') return 'png'
    if (format === 'image/webp') return 'webp'
    return 'jpg'
  }, [format])

  const convert = async () => {
    if (!file) return
    setBusy(true)
    try {
      const img = await fileToImage(file)
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, format, quality))
      setOutBlob(blob)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div className="h1" style={{ fontSize: 28 }}>Image Converter</div>
          <p className="p">Convert JPG/PNG/WebP in the browser.</p>
        </div>
        <span className="badge">Frontend only</span>
      </div>

      <div className="split">
        <div className="card">
          <div className="section">
            <label className="label">Upload image</label>
            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] || null
                setFile(f)
                setOutBlob(null)
              }}
            />

            <div style={{ height: 12 }} />

            <label className="label">Output format</label>
            <select className="select" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WebP</option>
            </select>

            <div style={{ height: 12 }} />

            <label className="label">Quality ({Math.round(quality * 100)}%)</label>
            <input className="input" type="range" min={0.5} max={0.98} step={0.02} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />

            <div style={{ height: 14 }} />

            <div className="row">
              <Button onClick={convert} disabled={!file || busy}>{busy ? 'Converting…' : 'Convert'}</Button>
              <Button
                variant="secondary"
                disabled={!outBlob}
                onClick={() => {
                  if (!outBlob) return
                  const name = (file?.name || 'image').replace(/\.[^.]+$/, '')
                  downloadBlob(outBlob, `${name}_converted.${outExt}`)
                }}
              >
                Download
              </Button>
            </div>
          </div>
        </div>

        <div className="card sticky">
          <div className="section">
            <div className="h2" style={{ margin: 0 }}>Preview</div>
            <div style={{ height: 10 }} />
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Uploaded"
                style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}
                onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
              />
            ) : (
              <div className="muted">Upload an image to preview.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
