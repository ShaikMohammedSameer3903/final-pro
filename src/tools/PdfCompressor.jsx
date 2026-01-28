import { useMemo, useState } from 'react'
import Button from '../components/Button.jsx'
import Loader from '../components/Loader.jsx'
import { bestEffortCompressPdf } from '../utils/pdfUtils.js'

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '-'
  const units = ['B', 'KB', 'MB', 'GB']
  let n = bytes
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(i === 0 ? 0 : 2)} ${units[i]}`
}

export default function PdfCompressor() {
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [outBlob, setOutBlob] = useState(null)

  const outUrl = useMemo(() => (outBlob ? URL.createObjectURL(outBlob) : null), [outBlob])

  const compress = async () => {
    if (!file) return
    setBusy(true)
    setOutBlob(null)
    try {
      const blob = await bestEffortCompressPdf(file)
      setOutBlob(blob)
    } finally {
      setBusy(false)
    }
  }

  const download = () => {
    if (!outBlob) return
    const a = document.createElement('a')
    a.href = outUrl
    a.download = `${file?.name?.replace(/\.pdf$/i, '') || 'compressed'}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="container">
      <div className="card">
        <div className="section">
          <div className="h1" style={{ fontSize: 28 }}>
            PDF Compressor
          </div>
          <p className="p">Client-side best-effort PDF re-save to reduce size when possible.</p>

          <div style={{ height: 14 }} />

          <div className="row" style={{ alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label className="label">Upload PDF</label>
              <input
                className="input"
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button onClick={compress} disabled={!file || busy}>
              Compress
            </Button>
            <Button variant="secondary" onClick={download} disabled={!outBlob || busy}>
              Download
            </Button>
          </div>

          <div style={{ height: 14 }} />

          {busy ? <Loader label="Compressing…" /> : null}

          <div style={{ height: 10 }} />

          <table className="table">
            <thead>
              <tr>
                <th>File</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Original</td>
                <td>{file ? formatBytes(file.size) : '-'}</td>
              </tr>
              <tr>
                <td>Output</td>
                <td>{outBlob ? formatBytes(outBlob.size) : '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
