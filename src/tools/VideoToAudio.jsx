import { useMemo, useState } from 'react'
import Button from '../components/Button.jsx'

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function audioBufferToWav(buffer) {
  const numOfChan = buffer.numberOfChannels
  const length = buffer.length * numOfChan * 2 + 44
  const out = new ArrayBuffer(length)
  const view = new DataView(out)

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }

  let offset = 0
  writeString(offset, 'RIFF')
  offset += 4
  view.setUint32(offset, 36 + buffer.length * numOfChan * 2, true)
  offset += 4
  writeString(offset, 'WAVE')
  offset += 4
  writeString(offset, 'fmt ')
  offset += 4
  view.setUint32(offset, 16, true)
  offset += 4
  view.setUint16(offset, 1, true)
  offset += 2
  view.setUint16(offset, numOfChan, true)
  offset += 2
  view.setUint32(offset, buffer.sampleRate, true)
  offset += 4
  view.setUint32(offset, buffer.sampleRate * numOfChan * 2, true)
  offset += 4
  view.setUint16(offset, numOfChan * 2, true)
  offset += 2
  view.setUint16(offset, 16, true)
  offset += 2
  writeString(offset, 'data')
  offset += 4
  view.setUint32(offset, buffer.length * numOfChan * 2, true)
  offset += 4

  const channels = []
  for (let i = 0; i < numOfChan; i++) channels.push(buffer.getChannelData(i))

  let sampleIndex = 0
  while (sampleIndex < buffer.length) {
    for (let ch = 0; ch < numOfChan; ch++) {
      let sample = channels[ch][sampleIndex]
      sample = Math.max(-1, Math.min(1, sample))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      offset += 2
    }
    sampleIndex += 1
  }

  return new Blob([out], { type: 'audio/wav' })
}

async function extractWav(file) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const arrayBuffer = await file.arrayBuffer()
  const buffer = await audioCtx.decodeAudioData(arrayBuffer)
  const wavBlob = audioBufferToWav(buffer)
  audioCtx.close()
  return wavBlob
}

export default function VideoToAudio() {
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [wav, setWav] = useState(null)
  const [mp3Busy, setMp3Busy] = useState(false)

  const nameBase = useMemo(() => (file?.name ? file.name.replace(/\.[^.]+$/, '') : 'audio'), [file])

  const makeWav = async () => {
    if (!file) return
    setBusy(true)
    try {
      const out = await extractWav(file)
      setWav(out)
    } finally {
      setBusy(false)
    }
  }

  const makeMp3 = async () => {
    if (!file) return
    setMp3Busy(true)
    try {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg')
      const { fetchFile } = await import('@ffmpeg/util')

      const ffmpeg = new FFmpeg()
      await ffmpeg.load()

      const inName = `input_${Date.now()}.mp4`
      const outName = `output_${Date.now()}.mp3`

      await ffmpeg.writeFile(inName, await fetchFile(file))
      await ffmpeg.exec(['-i', inName, '-vn', '-acodec', 'libmp3lame', '-q:a', '4', outName])

      const data = await ffmpeg.readFile(outName)
      const blob = new Blob([data.buffer], { type: 'audio/mpeg' })
      downloadBlob(blob, `${nameBase}.mp3`)

      await ffmpeg.deleteFile(inName)
      await ffmpeg.deleteFile(outName)
    } finally {
      setMp3Busy(false)
    }
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div className="h1" style={{ fontSize: 28 }}>Video → Audio</div>
          <p className="p">Extract audio locally. WAV is instant; MP3 is optional (downloads encoder on demand).</p>
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
                setFile(e.target.files?.[0] || null)
                setWav(null)
              }}
            />

            <div style={{ height: 12 }} />

            <div className="row">
              <Button onClick={makeWav} disabled={!file || busy}>{busy ? 'Extracting…' : 'Extract WAV'}</Button>
              <Button
                variant="secondary"
                disabled={!wav}
                onClick={() => {
                  if (!wav) return
                  downloadBlob(wav, `${nameBase}.wav`)
                }}
              >
                Download WAV
              </Button>
            </div>

            <div style={{ height: 12 }} />

            <div className="card" style={{ boxShadow: 'none' }}>
              <div className="section" style={{ padding: 12 }}>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>MP3 (advanced)</div>
                <div className="muted" style={{ marginBottom: 10 }}>
                  MP3 conversion uses ffmpeg.wasm and may take time on low-end devices. It is loaded only when you click.
                </div>
                <Button onClick={makeMp3} disabled={!file || mp3Busy}>
                  {mp3Busy ? 'Loading encoder…' : 'Export MP3'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="card sticky">
          <div className="section">
            <div className="h2" style={{ margin: 0 }}>Notes</div>
            <div style={{ height: 10 }} />
            <div className="muted">
              For interviews: this is a frontend-only pipeline. No files are uploaded; encoding happens in the browser.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
