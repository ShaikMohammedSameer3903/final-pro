import { useMemo, useRef, useState } from 'react'
import html2pdf from 'html2pdf.js'
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

function downloadText(text, filename) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function VideoSummary() {
  const [file, setFile] = useState(null)
  const [meta, setMeta] = useState(null)
  const [summary, setSummary] = useState('')
  const videoRef = useRef(null)
  const exportRef = useRef(null)

  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  const onLoaded = () => {
    const v = videoRef.current
    if (!v) return
    setMeta({
      duration: v.duration,
      width: v.videoWidth,
      height: v.videoHeight,
      size: file?.size || 0,
      type: file?.type || '',
      name: file?.name || '',
    })
  }

  const exportTxt = () => {
    if (!meta) return
    const text = `Video Summary\n\nName: ${meta.name}\nType: ${meta.type}\nSize: ${formatBytes(meta.size)}\nResolution: ${meta.width}x${meta.height}\nDuration: ${meta.duration.toFixed(2)}s\n\nSummary:\n${summary}\n`
    downloadText(text, 'video_summary.txt')
  }

  const exportPdf = async () => {
    if (!exportRef.current) return
    const opt = {
      margin: 10,
      filename: 'video_summary.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    }
    await html2pdf().set(opt).from(exportRef.current).save()
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div className="h1" style={{ fontSize: 28 }}>Video Summary</div>
          <p className="p">Upload a video, extract metadata, write a manual summary, export as TXT/PDF.</p>
        </div>
        <span className="badge">Frontend only</span>
      </div>

      <div className="split">
        <div className="card">
          <div className="section">
            <label className="label">Upload video</label>
            <input
              className="input"
              type="file"
              accept="video/*"
              onChange={(e) => {
                const f = e.target.files?.[0] || null
                setFile(f)
                setMeta(null)
                setSummary('')
              }}
            />

            <div style={{ height: 12 }} />

            <label className="label">Manual summary</label>
            <textarea className="textarea" rows={6} value={summary} onChange={(e) => setSummary(e.target.value)} />

            <div style={{ height: 12 }} />

            <div className="row">
              <Button onClick={exportTxt} disabled={!meta}>Download TXT</Button>
              <Button variant="secondary" onClick={exportPdf} disabled={!meta}>Download PDF</Button>
            </div>

            <div style={{ height: 12 }} />

            <div ref={exportRef} style={{ background: 'white', color: '#111', borderRadius: 12, padding: 14 }}>
              <div style={{ fontWeight: 900, fontSize: 18 }}>Video Summary</div>
              <div style={{ height: 8 }} />
              {meta ? (
                <div style={{ fontSize: 12, lineHeight: 1.4 }}>
                  <div><b>Name:</b> {meta.name}</div>
                  <div><b>Type:</b> {meta.type}</div>
                  <div><b>Size:</b> {formatBytes(meta.size)}</div>
                  <div><b>Resolution:</b> {meta.width}×{meta.height}</div>
                  <div><b>Duration:</b> {meta.duration.toFixed(2)}s</div>
                  <div style={{ height: 10 }} />
                  <div><b>Summary</b></div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{summary || '-'}</div>
                </div>
              ) : (
                <div style={{ color: '#444' }}>Upload a video to extract metadata.</div>
              )}
            </div>
          </div>
        </div>

        <div className="card sticky">
          <div className="section">
            <div className="h2" style={{ margin: 0 }}>Preview</div>
            <div style={{ height: 10 }} />
            {url ? (
              <video
                ref={videoRef}
                src={url}
                controls
                onLoadedMetadata={onLoaded}
                style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}
              />
            ) : (
              <div className="muted">Upload a video to preview.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
