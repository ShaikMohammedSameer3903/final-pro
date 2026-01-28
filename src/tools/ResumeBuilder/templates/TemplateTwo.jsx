function nonEmptyLines(text) {
  return (text || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function Section({ title, children }) {
  if (!children) return null
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: '#111' }} />
        <div style={{ fontSize: 12, letterSpacing: 1, fontWeight: 800, color: '#111' }}>{title}</div>
      </div>
      <div style={{ height: 10 }} />
      {children}
    </div>
  )
}

function levelWidth(level) {
  if (level === 'Beginner') return '33%'
  if (level === 'Advanced') return '100%'
  return '66%'
}

export default function TemplateTwo({ data, order }) {
  const p = data.personal
  const skills = (data.skills || []).filter((s) => (s?.name || '').trim())
  const education = (data.education || []).filter((e) => e.school || e.degree || e.details)
  const experience = (data.experience || []).filter((e) => e.company || e.role || e.details)
  const projects = (data.projects || []).filter((e) => e.name || e.details)

  const left = [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean)

  return (
    <div style={{ padding: 22, fontFamily: 'Arial, sans-serif', fontSize: 12, lineHeight: 1.45 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '0.62fr 1.38fr', gap: 16 }}>
        <div style={{ borderRight: '1px solid #eee', paddingRight: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#111' }}>{p.fullName || 'Your Name'}</div>
          <div style={{ fontSize: 12, color: '#444', marginTop: 2 }}>{p.title || 'Your Title'}</div>
          <div style={{ height: 10 }} />
          <div style={{ display: 'grid', gap: 6, color: '#333' }}>
            {left.map((x) => (
              <div key={x}>{x}</div>
            ))}
          </div>

          <Section
            title="SKILLS"
            children={
              skills.length ? (
                <div style={{ display: 'grid', gap: 8 }}>
                  {skills.map((s) => (
                    <div key={`${s.name}-${s.level}`}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                        <div style={{ color: '#222', fontWeight: 700 }}>{s.name}</div>
                        <div style={{ color: '#555' }}>{s.level}</div>
                      </div>
                      <div style={{ height: 6 }} />
                      <div style={{ height: 8, background: '#eee', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: levelWidth(s.level), background: '#111' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null
            }
          />
        </div>

        <div>
          {(() => {
            const blocks = {
              summary: data.summary?.trim() ? <Section title="SUMMARY" children={<div style={{ color: '#222' }}>{data.summary}</div>} /> : null,
              experience: experience.length ? (
                <Section
                  title="EXPERIENCE"
                  children={
                    <div style={{ display: 'grid', gap: 12 }}>
                      {experience.map((e, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                            <div style={{ fontWeight: 800, color: '#111' }}>{[e.role, e.company].filter(Boolean).join(' • ')}</div>
                            <div style={{ color: '#555' }}>{[e.start, e.end].filter(Boolean).join(' - ')}</div>
                          </div>
                          {e.details?.trim() ? (
                            <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
                              {nonEmptyLines(e.details).map((line) => (
                                <li key={line} style={{ marginBottom: 3 }}>
                                  {line}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  }
                />
              ) : null,
              education: education.length ? (
                <Section
                  title="EDUCATION"
                  children={
                    <div style={{ display: 'grid', gap: 12 }}>
                      {education.map((e, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                            <div style={{ fontWeight: 800, color: '#111' }}>{[e.degree, e.school].filter(Boolean).join(' • ')}</div>
                            <div style={{ color: '#555' }}>{[e.start, e.end].filter(Boolean).join(' - ')}</div>
                          </div>
                          {e.details?.trim() ? (
                            <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
                              {nonEmptyLines(e.details).map((line) => (
                                <li key={line} style={{ marginBottom: 3 }}>
                                  {line}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  }
                />
              ) : null,
              projects: projects.length ? (
                <Section
                  title="PROJECTS"
                  children={
                    <div style={{ display: 'grid', gap: 12 }}>
                      {projects.map((e, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                            <div style={{ fontWeight: 800, color: '#111' }}>{e.name}</div>
                            <div style={{ color: '#555' }}>{e.link}</div>
                          </div>
                          {e.details?.trim() ? (
                            <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
                              {nonEmptyLines(e.details).map((line) => (
                                <li key={line} style={{ marginBottom: 3 }}>
                                  {line}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  }
                />
              ) : null,
            }
            const keys = Array.isArray(order) && order.length ? order : ['summary', 'skills', 'experience', 'projects', 'education']
            return keys.map((k) => blocks[k]).filter(Boolean)
          })()}
        </div>
      </div>
    </div>
  )
}
