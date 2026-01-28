import { useMemo, useRef, useState } from 'react'
import html2pdf from 'html2pdf.js'
import Button from '../components/Button.jsx'

function addBlock(blocks, type) {
  const base = type === 'image' ? { type, value: '' } : { type, value: '' }
  return [...blocks, base]
}

function renderBlock(block, idx) {
  if (block.type === 'h1') return <h1 key={idx} style={{ margin: '8px 0' }}>{block.value}</h1>
  if (block.type === 'h2') return <h2 key={idx} style={{ margin: '8px 0' }}>{block.value}</h2>
  if (block.type === 'image') {
    return block.value ? (
      <div key={idx} style={{ margin: '10px 0' }}>
        <img alt="" src={block.value} style={{ maxWidth: '100%', borderRadius: 10 }} />
      </div>
    ) : null
  }
  return <p key={idx} style={{ margin: '8px 0', lineHeight: 1.6 }}>{block.value}</p>
}

export default function NotesToPdf() {
  const [title, setTitle] = useState('')
  const [blocks, setBlocks] = useState([{ type: 'p', value: '' }])
  const [exporting, setExporting] = useState(false)

  const previewRef = useRef(null)

  const cleanBlocks = useMemo(() => blocks.filter((b) => (b.value || '').trim()), [blocks])

  const exportPdf = async () => {
    if (!previewRef.current) return
    setExporting(true)
    try {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${(title || 'notes').trim().replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      }
      await html2pdf().set(opt).from(previewRef.current).save()
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div className="h1" style={{ fontSize: 28 }}>Notes → PDF</div>
          <p className="p">Write notes with headings and images, then export to PDF.</p>
        </div>
        <div className="row">
          <Button onClick={exportPdf} disabled={exporting}>
            {exporting ? 'Exporting…' : 'Download PDF'}
          </Button>
        </div>
      </div>

      <div className="split">
        <div className="card">
          <div className="section">
            <div className="h2" style={{ marginTop: 0 }}>Editor</div>
            <label className="label">Document title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />

            <div style={{ height: 12 }} />

            <div className="row">
              <Button variant="secondary" size="sm" onClick={() => setBlocks((b) => addBlock(b, 'h1'))}>Add H1</Button>
              <Button variant="secondary" size="sm" onClick={() => setBlocks((b) => addBlock(b, 'h2'))}>Add H2</Button>
              <Button variant="secondary" size="sm" onClick={() => setBlocks((b) => addBlock(b, 'p'))}>Add Text</Button>
              <Button variant="secondary" size="sm" onClick={() => setBlocks((b) => addBlock(b, 'image'))}>Add Image URL</Button>
            </div>

            <div style={{ height: 12 }} />

            <div className="grid" style={{ gap: 10 }}>
              {blocks.map((b, idx) => (
                <div key={idx} className="card" style={{ boxShadow: 'none' }}>
                  <div className="section">
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                      <span className="badge">{b.type.toUpperCase()}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBlocks((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        Remove
                      </Button>
                    </div>
                    <div style={{ height: 10 }} />
                    <textarea
                      className="textarea"
                      rows={b.type === 'image' ? 2 : 4}
                      value={b.value}
                      onChange={(e) =>
                        setBlocks((prev) => prev.map((x, i) => (i === idx ? { ...x, value: e.target.value } : x)))
                      }
                      placeholder={b.type === 'image' ? 'Paste image URL (https://...)' : 'Write here...'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card sticky">
          <div className="section">
            <div className="h2" style={{ marginTop: 0 }}>Preview</div>
            <div
              ref={previewRef}
              style={{
                background: 'white',
                color: '#111',
                borderRadius: 12,
                padding: 18,
                overflow: 'hidden',
              }}
            >
              {title?.trim() ? <h1 style={{ marginTop: 0 }}>{title}</h1> : null}
              {cleanBlocks.length ? cleanBlocks.map(renderBlock) : <div style={{ color: '#555' }}>Start writing…</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
