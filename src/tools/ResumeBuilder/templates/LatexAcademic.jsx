function nonEmptyLines(text) {
  return (text || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function Section({ title, children }) {
  if (!children) return null
  return (
    <section style={{ marginTop: 14 }}>
      <h2 style={{ margin: '0 0 6px', fontSize: 14, borderBottom: '1px solid #111', paddingBottom: 4 }}>{title}</h2>
      {children}
    </section>
  )
}

function Entry2Col({ leftTop, rightTop, leftBottom, rightBottom }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', columnGap: 12, rowGap: 2, alignItems: 'baseline' }}>
      <div style={{ fontWeight: 800 }}>{leftTop}</div>
      <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{rightTop}</div>
      <div style={{ fontStyle: 'italic', fontSize: 11 }}>{leftBottom}</div>
      <div style={{ textAlign: 'right', whiteSpace: 'nowrap', fontSize: 11 }}>{rightBottom}</div>
    </div>
  )
}

function BulletList({ text }) {
  const lines = nonEmptyLines(text)
  if (!lines.length) return null
  return (
    <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
      {lines.map((l) => (
        <li key={l} style={{ marginBottom: 4 }}>
          {l}
        </li>
      ))}
    </ul>
  )
}

export default function LatexAcademic({ data, order, enabled, settings }) {
  const spacing = settings?.spacing || 'compact'
  const font = settings?.font || 'serif'

  const fontFamily = font === 'sans' ? 'Inter, Arial, sans-serif' : 'Times New Roman, Times, serif'

  const headerLeft = [data.personal?.name, data.personal?.email].filter(Boolean)
  const headerRight = [data.personal?.phone, data.personal?.website].filter(Boolean)

  const blocks = {
    education: data.education?.length ? (
      <Section
        title="Education"
        children={
          <div style={{ display: 'grid', gap: spacing === 'spacious' ? 12 : 8 }}>
            {data.education.map((e, idx) => (
              <div key={idx}>
                <Entry2Col leftTop={e.institution} rightTop={e.date} leftBottom={e.degree} rightBottom={e.location} />
                <BulletList text={e.details} />
              </div>
            ))}
          </div>
        }
      />
    ) : null,
    experience: data.experience?.length ? (
      <Section
        title="Research / Experience"
        children={
          <div style={{ display: 'grid', gap: spacing === 'spacious' ? 12 : 8 }}>
            {data.experience.map((e, idx) => (
              <div key={idx}>
                <Entry2Col leftTop={e.title} rightTop={e.date} leftBottom={e.company} rightBottom={e.location} />
                <BulletList text={e.details} />
              </div>
            ))}
          </div>
        }
      />
    ) : null,
    publications: data.publications?.length ? (
      <Section
        title="Publications"
        children={
          <ol style={{ margin: '6px 0 0 18px', padding: 0 }}>
            {data.publications.map((p, idx) => (
              <li key={idx} style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 800 }}>{p.title}</div>
                <div style={{ fontSize: 11 }}>
                  {[p.authors, p.venue, p.year].filter(Boolean).join(' • ')}
                </div>
              </li>
            ))}
          </ol>
        }
      />
    ) : null,
    projects: data.projects?.length ? (
      <Section
        title="Projects"
        children={
          <div style={{ display: 'grid', gap: spacing === 'spacious' ? 12 : 8 }}>
            {data.projects.map((p, idx) => (
              <div key={idx}>
                <Entry2Col leftTop={p.name} rightTop={p.date} leftBottom={p.link || ''} rightBottom={''} />
                <BulletList text={p.details} />
              </div>
            ))}
          </div>
        }
      />
    ) : null,
    skills: data.skills?.length ? (
      <Section
        title="Skills"
        children={
          <div style={{ display: 'grid', gap: 6 }}>
            {data.skills.map((s, idx) => (
              <div key={idx}>
                <span style={{ fontWeight: 800 }}>{s.category}:</span> <span>{(s.items || []).join(', ')}</span>
              </div>
            ))}
          </div>
        }
      />
    ) : null,
    certifications: data.certifications?.length ? (
      <Section
        title="Certifications"
        children={
          <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
            {data.certifications.map((c, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                <span style={{ fontWeight: 800 }}>{c.name}</span>
                {c.issuer ? <span> — {c.issuer}</span> : null}
                {c.year ? <span> ({c.year})</span> : null}
              </li>
            ))}
          </ul>
        }
      />
    ) : null,
  }

  const keys = Array.isArray(order) && order.length ? order : ['education', 'experience', 'publications', 'projects', 'skills', 'certifications']

  return (
    <div style={{ padding: 22, fontFamily, fontSize: 12, lineHeight: spacing === 'spacious' ? 1.5 : spacing === 'normal' ? 1.4 : 1.32 }}>
      <header style={{ display: 'grid', gridTemplateColumns: '70% 30%', gap: 10, alignItems: 'start' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>{data.personal?.name || 'Your Name'}</h1>
          <div style={{ fontSize: 11, marginTop: 4 }}>{headerLeft.filter((x) => x !== data.personal?.name).join(' • ')}</div>
        </div>
        <div style={{ fontSize: 11, textAlign: 'right' }}>{headerRight.join(' • ')}</div>
      </header>

      {keys
        .filter((k) => (enabled ? enabled[k] !== false : true))
        .map((k) => blocks[k])
        .filter(Boolean)}
    </div>
  )
}
