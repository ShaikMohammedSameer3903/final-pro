function nonEmptyLines(text) {
  return (text || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function Header({ data }) {
  const p = data.personal
  const left = [p.github, p.linkedin].filter(Boolean)
  const right = [p.website, p.email].filter(Boolean)

  return (
    <header>
      <h1 style={{ fontSize: 22, margin: 0, textAlign: 'center', letterSpacing: 0.2 }}>{p.name || 'Your Name'}</h1>
      <div style={{ height: 8 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ textAlign: 'left', fontSize: 11 }}>
          {left.map((x) => (
            <div key={x}>{x}</div>
          ))}
        </div>
        <div style={{ textAlign: 'right', fontSize: 11 }}>
          {right.map((x) => (
            <div key={x}>{x}</div>
          ))}
        </div>
      </div>
    </header>
  )
}

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        margin: '14px 0 6px',
        textAlign: 'center',
        fontSize: 13,
        letterSpacing: 0.2,
        borderBottom: '1px solid #111',
        paddingBottom: 3,
      }}
    >
      {children}
    </h2>
  )
}

function Entry2Col({ leftTop, rightTop, leftBottom, rightBottom }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
      <div style={{ fontWeight: 700 }}>{leftTop}</div>
      <div style={{ textAlign: 'right' }}>{rightTop}</div>
      <div style={{ fontStyle: 'italic', fontSize: 11 }}>{leftBottom}</div>
      <div style={{ textAlign: 'right', fontStyle: 'italic', fontSize: 11 }}>{rightBottom}</div>
    </div>
  )
}

function BulletList({ text }) {
  const lines = nonEmptyLines(text)
  if (!lines.length) return null
  return (
    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
      {lines.map((l) => (
        <li key={l} style={{ marginBottom: 4 }}>
          {l}
        </li>
      ))}
    </ul>
  )
}

export default function LatexClassic({ data, order, enabled, settings }) {
  const spacing = settings?.spacing || 'compact'
  const font = settings?.font || 'latexClassic'

  const fontFamily =
    font === 'serif' ? 'Times New Roman, Times, serif' : font === 'sans' ? 'Inter, Arial, sans-serif' : 'Source Sans Pro, Times New Roman, serif'

  const base = {
    fontFamily,
    letterSpacing: 0.2,
    lineHeight: spacing === 'spacious' ? 1.45 : spacing === 'normal' ? 1.35 : 1.3,
    fontSize: 12,
  }

  const blocks = {
    education: data.education?.length ? (
      <section>
        <SectionTitle>Education</SectionTitle>
        <div style={{ display: 'grid', gap: spacing === 'spacious' ? 12 : 8 }}>
          {data.education.map((e, idx) => (
            <div key={idx}>
              <Entry2Col
                leftTop={e.institution}
                rightTop={e.date || ''}
                leftBottom={e.degree || ''}
                rightBottom={e.location || ''}
              />
              <BulletList text={e.details} />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    experience: data.experience?.length ? (
      <section>
        <SectionTitle>Experience</SectionTitle>
        <div style={{ display: 'grid', gap: spacing === 'spacious' ? 12 : 8 }}>
          {data.experience.map((e, idx) => (
            <div key={idx}>
              <Entry2Col
                leftTop={e.title}
                rightTop={e.date || ''}
                leftBottom={e.company || ''}
                rightBottom={e.location || ''}
              />
              <BulletList text={e.details} />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    publications: data.publications?.length ? (
      <section>
        <SectionTitle>Publications</SectionTitle>
        <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
          {data.publications.map((p, idx) => (
            <li key={idx} style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 700 }}>{p.title}</span>
              {p.venue ? <span> — {p.venue}</span> : null}
              {p.year ? <span> ({p.year})</span> : null}
            </li>
          ))}
        </ul>
      </section>
    ) : null,
    projects: data.projects?.length ? (
      <section>
        <SectionTitle>Projects</SectionTitle>
        <div style={{ display: 'grid', gap: spacing === 'spacious' ? 12 : 8 }}>
          {data.projects.map((p, idx) => (
            <div key={idx}>
              <Entry2Col leftTop={p.name} rightTop={p.date || ''} leftBottom={p.link || ''} rightBottom={''} />
              <BulletList text={p.details} />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    skills: data.skills?.length ? (
      <section>
        <SectionTitle>Skills</SectionTitle>
        <div style={{ display: 'grid', gap: 6 }}>
          {data.skills.map((s, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 8 }}>
              <div style={{ fontWeight: 700 }}>{s.category || 'Skill'}</div>
              <div>{(s.items || []).join(', ')}</div>
            </div>
          ))}
        </div>
      </section>
    ) : null,
    certifications: data.certifications?.length ? (
      <section>
        <SectionTitle>Certifications</SectionTitle>
        <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
          {data.certifications.map((c, idx) => (
            <li key={idx} style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 700 }}>{c.name}</span>
              {c.issuer ? <span> — {c.issuer}</span> : null}
              {c.year ? <span> ({c.year})</span> : null}
            </li>
          ))}
        </ul>
      </section>
    ) : null,
  }

  const keys = Array.isArray(order) && order.length ? order : ['education', 'experience', 'projects', 'publications', 'skills', 'certifications']

  return (
    <div style={{ ...base, padding: 22 }}>
      <Header data={data} />
      {keys
        .filter((k) => (enabled ? enabled[k] !== false : true))
        .map((k) => blocks[k])
        .filter(Boolean)}
    </div>
  )
}
