import { useMemo, useState } from 'react'
import Button from '../components/Button.jsx'

function randomInt(max) {
  return Math.floor(Math.random() * max)
}

function buildCharset({ upper, lower, numbers, special }) {
  const U = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const L = 'abcdefghijklmnopqrstuvwxyz'
  const N = '0123456789'
  const S = '!@#$%^&*()_+-={}[]|:;,.?/~'

  let out = ''
  if (upper) out += U
  if (lower) out += L
  if (numbers) out += N
  if (special) out += S
  return out
}

function generatePassword(length, opts) {
  const charset = buildCharset(opts)
  if (!charset) return ''

  let out = ''
  for (let i = 0; i < length; i++) {
    out += charset[randomInt(charset.length)]
  }
  return out
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [upper, setUpper] = useState(true)
  const [lower, setLower] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [special, setSpecial] = useState(true)
  const [nonce, setNonce] = useState(0)

  const password = useMemo(
    () => generatePassword(length, { upper, lower, numbers, special }),
    [length, upper, lower, numbers, special, nonce],
  )

  const copy = async () => {
    if (!password) return
    await navigator.clipboard.writeText(password)
  }

  return (
    <div className="container">
      <div className="card">
        <div className="section">
          <div className="h1" style={{ fontSize: 28 }}>Password Generator</div>
          <p className="p">Generate strong passwords with custom options.</p>

          <div style={{ height: 14 }} />

          <div className="card" style={{ boxShadow: 'none' }}>
            <div className="section">
              <label className="label">Generated password</label>
              <input className="input" readOnly value={password} />
              <div style={{ height: 12 }} />
              <div className="row">
                <Button onClick={copy} disabled={!password}>Copy</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setNonce((n) => n + 1)
                  }}
                >
                  Regenerate
                </Button>
              </div>
            </div>
          </div>

          <div style={{ height: 14 }} />

          <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
            <div className="card" style={{ boxShadow: 'none' }}>
              <div className="section">
                <label className="label">Length: {length}</label>
                <input
                  className="input"
                  type="range"
                  min={6}
                  max={40}
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="card" style={{ boxShadow: 'none' }}>
              <div className="section">
                <div className="grid" style={{ gap: 10 }}>
                  <label className="row" style={{ justifyContent: 'space-between' }}>
                    <span>Uppercase</span>
                    <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} />
                  </label>
                  <label className="row" style={{ justifyContent: 'space-between' }}>
                    <span>Lowercase</span>
                    <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} />
                  </label>
                  <label className="row" style={{ justifyContent: 'space-between' }}>
                    <span>Numbers</span>
                    <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} />
                  </label>
                  <label className="row" style={{ justifyContent: 'space-between' }}>
                    <span>Special characters</span>
                    <input type="checkbox" checked={special} onChange={(e) => setSpecial(e.target.checked)} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 12 }} />

          {!buildCharset({ upper, lower, numbers, special }) ? (
            <div className="badge" style={{ borderColor: 'rgba(255,77,79,0.5)', color: 'rgba(255,77,79,0.95)' }}>
              Enable at least one option.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
