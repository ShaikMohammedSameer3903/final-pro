import { useMemo, useState } from 'react'
import Button from '../components/Button.jsx'

const GRADES = [
  { label: 'O (10)', value: 10 },
  { label: 'A+ (9)', value: 9 },
  { label: 'A (8)', value: 8 },
  { label: 'B+ (7)', value: 7 },
  { label: 'B (6)', value: 6 },
  { label: 'C (5)', value: 5 },
  { label: 'U / F (0)', value: 0 },
]

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export default function CgpaCalculator() {
  const [rows, setRows] = useState([{ subject: '', credits: 3, grade: 10 }])

  const totals = useMemo(() => {
    const credits = rows.reduce((sum, r) => sum + (Number(r.credits) || 0), 0)
    const points = rows.reduce((sum, r) => sum + (Number(r.credits) || 0) * (Number(r.grade) || 0), 0)
    const gpa = credits ? points / credits : 0
    return { credits, points, gpa }
  }, [rows])

  return (
    <div className="container">
      <div className="card">
        <div className="section">
          <div className="h1" style={{ fontSize: 28 }}>CGPA Calculator</div>
          <p className="p">Add subjects, credits and grades to calculate GPA/CGPA.</p>

          <div style={{ height: 14 }} />

          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="badge">Total credits: {totals.credits}</span>
            <span className="badge">GPA: {round2(totals.gpa)}</span>
          </div>

          <div style={{ height: 14 }} />

          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Subject</th>
                <th style={{ width: '20%' }}>Credits</th>
                <th style={{ width: '25%' }}>Grade</th>
                <th style={{ width: '10%' }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      className="input"
                      value={r.subject}
                      onChange={(e) => setRows((prev) => prev.map((x, i) => (i === idx ? { ...x, subject: e.target.value } : x)))}
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      type="number"
                      min={0}
                      value={r.credits}
                      onChange={(e) =>
                        setRows((prev) => prev.map((x, i) => (i === idx ? { ...x, credits: e.target.value } : x)))
                      }
                    />
                  </td>
                  <td>
                    <select
                      className="select"
                      value={r.grade}
                      onChange={(e) => setRows((prev) => prev.map((x, i) => (i === idx ? { ...x, grade: e.target.value } : x)))}
                    >
                      {GRADES.map((g) => (
                        <option key={g.label} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRows((prev) => prev.filter((_, i) => i !== idx))}
                      disabled={rows.length === 1}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ height: 12 }} />

          <div className="row">
            <Button variant="secondary" onClick={() => setRows((prev) => [...prev, { subject: '', credits: 3, grade: 10 }])}>
              Add Subject
            </Button>
            <Button variant="secondary" onClick={() => setRows([{ subject: '', credits: 3, grade: 10 }])}>
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
