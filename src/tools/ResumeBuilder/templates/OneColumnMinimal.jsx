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
      <h2 style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 800 }}>{title}</h2>
      {children}
    </section>
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

function Entry2Col({ leftTop, rightTop, leftBottom, rightBottom }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', columnGap: 12, rowGap: 2, alignItems: 'baseline' }}>
      <div style={{ fontWeight: 800 }}>{leftTop}</div>
      <div style={{ textAlign: 'right', whiteSpace: 'nowrap', fontSize: 11 }}>{rightTop}</div>
      <div style={{ fontSize: 11, fontStyle: 'italic' }}>{leftBottom}</div>
      <div style={{ textAlign: 'right', whiteSpace: 'nowrap', fontSize: 11 }}>{rightBottom}</div>
    </div>
  )
}

export default function OneColumnMinimal({ data, order, enabled, settings }) {
  const spacing = settings?.spacing || 'normal'
  const font = settings?.font || 'sans'
  const fontFamily = font === 'serif' ? 'Times New Roman, Times, serif' : 'Inter, Arial, sans-serif'

  const blocks = {
    education: data.education?.length ? (
      <Section
        title="Education"
        children={
          <div style={{ display: 'grid', gap: spacing === 'spacious' ? 12 : 8 }}>
            {data.education.map((e, idx) => (
              <div key={idx}>
                <Entry2Col leftTop={e.institution} rightTop={e.date || ''} leftBottom={e.degree || ''} rightBottom={e.location || ''} />
                <BulletList text={e.details} />
              </div>
            ))}
          </div>
        }
      />
    ) : null,
    experience: data.experience?.length ? (
      <Section
        title="Experience"
        children={
          <div style={{ display: 'grid', gap: spacing === 'spacious' ? 12 : 8 }}>
            {data.experience.map((e, idx) => (
              <div key={idx}>
                <Entry2Col
                  leftTop={e.title || ''}
                  rightTop={e.date || ''}
                  leftBottom={e.company || ''}
                  rightBottom={e.location || ''}
                />
                <BulletList text={e.details} />
              </div>
            ))}
          </div>
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
                <Entry2Col leftTop={p.name || ''} rightTop={p.date || ''} leftBottom={p.link || ''} rightBottom={''} />
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
                {c.name}
              </li>
            ))}
          </ul>
        }
      />
    ) : null,
    publications: data.publications?.length ? (
      <Section
        title="Publications"
        children={
          <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
            {data.publications.map((p, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                {p.title}
              </li>
            ))}
          </ul>
        }
      />
    ) : null,
  }

  const keys = Array.isArray(order) && order.length ? order : ['education', 'experience', 'projects', 'skills', 'certifications', 'publications']

  return (
    <div style={{ padding: 22, fontFamily, fontSize: 12, lineHeight: spacing === 'spacious' ? 1.5 : spacing === 'compact' ? 1.32 : 1.4 }}>
      <header>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>{data.personal?.name || 'Your Name'}</h1>
        <div style={{ fontSize: 11, marginTop: 6 }}>
          {[data.personal?.email, data.personal?.phone, data.personal?.github, data.personal?.linkedin, data.personal?.website]
            .filter(Boolean)
            .join(' • ')}
        </div>
      </header>

      {keys
        .filter((k) => (enabled ? enabled[k] !== false : true))
        .map((k) => blocks[k])
        .filter(Boolean)}
    </div>
  )
}
