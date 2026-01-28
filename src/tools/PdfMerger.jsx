import { useMemo, useState } from 'react'
import Button from '../components/Button.jsx'
import Loader from '../components/Loader.jsx'
import { mergePdfs } from '../utils/pdfUtils.js'

function move(list, from, to) {
  const copy = [...list]
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}

export default function PdfMerger() {
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [outBlob, setOutBlob] = useState(null)

  const outUrl = useMemo(() => (outBlob ? URL.createObjectURL(outBlob) : null), [outBlob])

  const onPick = (picked) => {
    const arr = Array.from(picked || [])
    setFiles(arr)
    setOutBlob(null)
  }

  const merge = async () => {
    if (files.length < 2) return
    setBusy(true)
    setOutBlob(null)
    try {
      const blob = await mergePdfs(files)
      setOutBlob(blob)
    } finally {
      setBusy(false)
    }
  }

  const download = () => {
    if (!outBlob) return
    const a = document.createElement('a')
    a.href = outUrl
    a.download = 'merged.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="container">
      <div className="card">
        <div className="section">
          <div className="h1" style={{ fontSize: 28 }}>
            PDF Merger
          </div>
          <p className="p">Upload multiple PDFs, reorder, merge, and download.</p>

          <div style={{ height: 14 }} />

          <div className="row" style={{ alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label className="label">Upload PDFs</label>
              <input
                className="input"
                type="file"
                accept="application/pdf"
                multiple
                onChange={(e) => onPick(e.target.files)}
              />
            </div>
            <Button onClick={merge} disabled={files.length < 2 || busy}>
              Merge
            </Button>
            <Button variant="secondary" onClick={download} disabled={!outBlob || busy}>
              Download
            </Button>
          </div>

          <div style={{ height: 14 }} />

          {busy ? <Loader label="Merging…" /> : null}

          <div style={{ height: 10 }} />

          {files.length ? (
            <div className="grid" style={{ gap: 10 }}>
              {files.map((f, idx) => (
                <div key={`${f.name}-${idx}`} className="card" style={{ boxShadow: 'none' }}>
                  <div className="section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{idx + 1}. {f.name}</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {(f.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <div className="row">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={idx === 0}
                        onClick={() => {
                          setFiles(move(files, idx, idx - 1))
                          setOutBlob(null)
                        }}
                      >
                        Up
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={idx === files.length - 1}
                        onClick={() => {
                          setFiles(move(files, idx, idx + 1))
                          setOutBlob(null)
                        }}
                      >
                        Down
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFiles(files.filter((_, i) => i !== idx))
                          setOutBlob(null)
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="muted">Pick at least 2 PDFs to merge.</div>
          )}
        </div>
      </div>
    </div>
  )
}
