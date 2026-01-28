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

export default function ImageResizer() {
  const [file, setFile] = useState(null)
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(800)
  const [lockAspect, setLockAspect] = useState(true)
  const [quality, setQuality] = useState(0.92)
  const [busy, setBusy] = useState(false)
  const [outBlob, setOutBlob] = useState(null)
  const [natural, setNatural] = useState({ w: 0, h: 0 })

  const ratio = useMemo(() => {
    if (!natural.w || !natural.h) return 1
    return natural.w / natural.h
  }, [natural])

  const resize = async () => {
    if (!file) return
    setBusy(true)
    try {
      const img = await fileToImage(file)
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(width))
      canvas.height = Math.max(1, Math.round(height))
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
      setOutBlob(blob)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div className="h1" style={{ fontSize: 28 }}>Image Resizer</div>
          <p className="p">Resize images client-side. Export as JPG.</p>
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
              onChange={async (e) => {
                const f = e.target.files?.[0] || null
                setFile(f)
                setOutBlob(null)
                if (!f) return
                const img = await fileToImage(f)
                setNatural({ w: img.width, h: img.height })
                setWidth(img.width)
                setHeight(img.height)
              }}
            />

            <div style={{ height: 12 }} />

            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
              <div>
                <label className="label">Width</label>
                <input
                  className="input"
                  type="number"
                  value={width}
                  onChange={(e) => {
                    const v = Number(e.target.value || 0)
                    setWidth(v)
                    if (lockAspect) setHeight(Math.round(v / ratio))
                  }}
                />
              </div>
              <div>
                <label className="label">Height</label>
                <input
                  className="input"
                  type="number"
                  value={height}
                  onChange={(e) => {
                    const v = Number(e.target.value || 0)
                    setHeight(v)
                    if (lockAspect) setWidth(Math.round(v * ratio))
                  }}
                />
              </div>
            </div>

            <div style={{ height: 10 }} />

            <label className="row" style={{ justifyContent: 'space-between' }}>
              <span className="p" style={{ margin: 0 }}>Maintain aspect ratio</span>
              <input type="checkbox" checked={lockAspect} onChange={() => setLockAspect((v) => !v)} />
            </label>

            <div style={{ height: 12 }} />

            <label className="label">Quality ({Math.round(quality * 100)}%)</label>
            <input className="input" type="range" min={0.5} max={0.98} step={0.02} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />

            <div style={{ height: 14 }} />

            <div className="row">
              <Button onClick={resize} disabled={!file || busy}>{busy ? 'Resizing…' : 'Resize'}</Button>
              <Button
                variant="secondary"
                disabled={!outBlob}
                onClick={() => {
                  if (!outBlob) return
                  const name = (file?.name || 'image').replace(/\.[^.]+$/, '')
                  downloadBlob(outBlob, `${name}_${width}x${height}.jpg`)
                }}
              >
                Download
              </Button>
            </div>

            <div style={{ height: 10 }} />
            {natural.w ? <div className="muted">Original: {natural.w}×{natural.h}</div> : null}
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
