import { useMemo, useState } from 'react'
import Button from '../components/Button.jsx'

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '-'
  const units = ['B', 'KB', 'MB', 'GB']
  let v = bytes
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i += 1
  }
  return `${v.toFixed(i === 0 ? 0 : 2)} ${units[i]}`
}

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

export default function ImageCompressor() {
  const [file, setFile] = useState(null)
  const [quality, setQuality] = useState(0.8)
  const [maxWidth, setMaxWidth] = useState(1600)
  const [keepFormat, setKeepFormat] = useState(false)
  const [busy, setBusy] = useState(false)
  const [outBlob, setOutBlob] = useState(null)

  const inSize = useMemo(() => (file ? file.size : null), [file])
  const outSize = useMemo(() => (outBlob ? outBlob.size : null), [outBlob])

  const compress = async () => {
    if (!file) return
    setBusy(true)
    try {
      const img = await fileToImage(file)
      const canvas = document.createElement('canvas')
      const scale = Math.min(1, maxWidth / img.width)
      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const type = keepFormat ? file.type || 'image/jpeg' : 'image/jpeg'
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, quality))
      setOutBlob(blob)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div className="h1" style={{ fontSize: 28 }}>Image Compressor</div>
          <p className="p">Compress locally using Canvas. No uploads.</p>
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

            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
              <div>
                <label className="label">Quality ({Math.round(quality * 100)}%)</label>
                <input className="input" type="range" min={0.2} max={0.95} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
              </div>
              <div>
                <label className="label">Max width (px)</label>
                <input className="input" type="number" value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value || 0))} />
              </div>
            </div>

            <div style={{ height: 10 }} />

            <label className="row" style={{ justifyContent: 'space-between' }}>
              <span className="p" style={{ margin: 0 }}>Keep original format</span>
              <input type="checkbox" checked={keepFormat} onChange={() => setKeepFormat((v) => !v)} />
            </label>

            <div style={{ height: 14 }} />

            <div className="row">
              <Button onClick={compress} disabled={!file || busy}>{busy ? 'Compressing…' : 'Compress'}</Button>
              <Button
                variant="secondary"
                disabled={!outBlob}
                onClick={() => {
                  if (!outBlob) return
                  const name = (file?.name || 'image').replace(/\.[^.]+$/, '')
                  const ext = keepFormat && file?.type === 'image/png' ? 'png' : 'jpg'
                  downloadBlob(outBlob, `${name}_compressed.${ext}`)
                }}
              >
                Download
              </Button>
            </div>

            <div style={{ height: 12 }} />
            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
              <div className="card" style={{ boxShadow: 'none' }}>
                <div className="section" style={{ padding: 12 }}>
                  <div className="label">Original</div>
                  <div style={{ fontWeight: 800 }}>{formatBytes(inSize)}</div>
                </div>
              </div>
              <div className="card" style={{ boxShadow: 'none' }}>
                <div className="section" style={{ padding: 12 }}>
                  <div className="label">Compressed</div>
                  <div style={{ fontWeight: 800 }}>{formatBytes(outSize)}</div>
                </div>
              </div>
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
