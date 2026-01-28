import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '../components/Button.jsx'
import { STORAGE_KEYS } from '../utils/constants.js'
import { loadJson, saveJson } from '../utils/storage.js'

function pad2(n) {
  return String(n).padStart(2, '0')
}

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${pad2(m)}:${pad2(s)}`
}

export default function PomodoroTimer() {
  const workSeconds = 25 * 60
  const breakSeconds = 5 * 60

  const [mode, setMode] = useState('work')
  const [running, setRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(workSeconds)

  const historyInitial = useMemo(() => loadJson(STORAGE_KEYS.pomodoroHistory, []), [])
  const [history, setHistory] = useState(historyInitial)

  const timerRef = useRef(null)

  useEffect(() => {
    saveJson(STORAGE_KEYS.pomodoroHistory, history)
  }, [history])

  useEffect(() => {
    if (!running) return

    timerRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) return 0
        return s - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [running])

  useEffect(() => {
    if (!running) return
    if (secondsLeft !== 0) return

    const endedMode = mode
    const nextMode = endedMode === 'work' ? 'break' : 'work'
    setMode(nextMode)
    setSecondsLeft(nextMode === 'work' ? workSeconds : breakSeconds)

    if (endedMode === 'work') {
      setHistory((prev) => [
        {
          endedAt: new Date().toISOString(),
          durationMinutes: 25,
        },
        ...prev,
      ])
    }
  }, [secondsLeft, running, mode])

  const start = () => setRunning(true)
  const pause = () => setRunning(false)
  const reset = () => {
    setRunning(false)
    setMode('work')
    setSecondsLeft(workSeconds)
  }

  const clearHistory = () => setHistory([])

  const totalSessions = history.length

  return (
    <div className="container">
      <div className="split">
        <div className="card">
          <div className="section">
            <div className="h1" style={{ fontSize: 28 }}>Pomodoro Timer</div>
            <p className="p">25 / 5 cycle with session history saved locally.</p>

            <div style={{ height: 16 }} />

            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="badge">Mode: {mode === 'work' ? 'Work (25m)' : 'Break (5m)'}</span>
              <span className="badge">Sessions: {totalSessions}</span>
            </div>

            <div style={{ height: 16 }} />

            <div
              className="card"
              style={{
                boxShadow: 'none',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 18,
              }}
            >
              <div className="section" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: 1 }}>{formatTime(secondsLeft)}</div>
                <div className="muted">{running ? 'Running' : 'Paused'}</div>
                <div style={{ height: 14 }} />
                <div className="row" style={{ justifyContent: 'center' }}>
                  {running ? (
                    <Button variant="secondary" onClick={pause}>Pause</Button>
                  ) : (
                    <Button onClick={start}>Start</Button>
                  )}
                  <Button variant="secondary" onClick={reset}>Reset</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card sticky">
          <div className="section">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="h2" style={{ margin: 0 }}>Session History</div>
              <Button variant="ghost" size="sm" onClick={clearHistory} disabled={!history.length}>Clear</Button>
            </div>

            <div style={{ height: 10 }} />

            {history.length ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Ended At</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 25).map((h, idx) => (
                    <tr key={idx}>
                      <td>{new Date(h.endedAt).toLocaleString()}</td>
                      <td>{h.durationMinutes}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="muted">No sessions yet. Complete a 25-minute work session to log it.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
