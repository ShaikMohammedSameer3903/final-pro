import { useMemo, useRef, useState } from 'react'
import html2pdf from 'html2pdf.js'
import Button from '../components/Button.jsx'

function downloadText(text, filename) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function isLikelyYouTubeUrl(url) {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    return host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be'
  } catch {
    return false
  }
}

export default function YouTubeSummary() {
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [meta, setMeta] = useState(null)
  const [summary, setSummary] = useState('')
  const exportRef = useRef(null)

  const canFetch = useMemo(() => Boolean(url.trim()) && isLikelyYouTubeUrl(url.trim()), [url])

  const fetchMeta = async () => {
    const u = url.trim()
    if (!u) return
    setBusy(true)
    try {
      const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(u)}&format=json`
      const res = await fetch(oembed)
      if (!res.ok) throw new Error('Failed to fetch YouTube metadata')
      const data = await res.json()
      setMeta({
        title: data.title || '',
        authorName: data.author_name || '',
        authorUrl: data.author_url || '',
        thumbnailUrl: data.thumbnail_url || '',
        html: data.html || '',
        url: u,
      })
    } finally {
      setBusy(false)
    }
  }

  const exportTxt = () => {
    if (!meta) return
    const text = `YouTube Summary\n\nTitle: ${meta.title}\nChannel: ${meta.authorName}\nChannel URL: ${meta.authorUrl}\nVideo URL: ${meta.url}\n\nSummary:\n${summary}\n`
    downloadText(text, 'youtube_summary.txt')
  }

  const exportPdf = async () => {
    if (!exportRef.current) return
    const opt = {
      margin: 10,
      filename: 'youtube_summary.pdf',
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
          <div className="h1" style={{ fontSize: 28 }}>YouTube Link Summary</div>
          <p className="p">Paste a YouTube URL, fetch video metadata, write a manual summary, export as TXT/PDF.</p>
        </div>
        <span className="badge">No AI backend</span>
      </div>

      <div className="split">
        <div className="card">
          <div className="section">
            <label className="label">YouTube URL</label>
            <input
              className="input"
              value={url}
              placeholder="https://www.youtube.com/watch?v=..."
              onChange={(e) => {
                setUrl(e.target.value)
                setMeta(null)
              }}
            />

            <div style={{ height: 12 }} />

            <div className="row">
              <Button onClick={fetchMeta} disabled={!canFetch || busy}>
                {busy ? 'Fetching…' : 'Fetch Metadata'}
              </Button>
            </div>

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
              <div style={{ fontWeight: 900, fontSize: 18 }}>YouTube Summary</div>
              <div style={{ height: 8 }} />
              {meta ? (
                <div style={{ fontSize: 12, lineHeight: 1.4 }}>
                  <div><b>Title:</b> {meta.title}</div>
                  <div><b>Channel:</b> {meta.authorName}</div>
                  <div><b>Video URL:</b> {meta.url}</div>
                  <div style={{ height: 10 }} />
                  <div><b>Summary</b></div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{summary || '-'}</div>
                </div>
              ) : (
                <div style={{ color: '#444' }}>Paste a YouTube URL and fetch metadata.</div>
              )}
            </div>
          </div>
        </div>

        <div className="card sticky">
          <div className="section">
            <div className="h2" style={{ margin: 0 }}>Preview</div>
            <div style={{ height: 10 }} />
            {meta ? (
              <div className="grid" style={{ gap: 10 }}>
                {meta.thumbnailUrl ? (
                  <img
                    src={meta.thumbnailUrl}
                    alt="Thumbnail"
                    style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                ) : null}
                <div className="card" style={{ boxShadow: 'none' }}>
                  <div className="section" style={{ padding: 12 }}>
                    <div style={{ fontWeight: 900 }}>{meta.title}</div>
                    <div className="muted" style={{ marginTop: 6 }}>{meta.authorName}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="muted">No metadata loaded yet.</div>
            )}

            <div style={{ height: 12 }} />
            <div className="muted">
              Interview note: this uses YouTube oEmbed (no API key) and stores nothing on a server.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
