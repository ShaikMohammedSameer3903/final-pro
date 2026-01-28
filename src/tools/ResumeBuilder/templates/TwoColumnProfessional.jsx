function nonEmptyLines(text) {
  return (text || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function Section({ title, children }) {
  if (!children) return null
  return (
    <section style={{ marginTop: 12 }}>
      <h2 style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 900, borderBottom: '1px solid #ddd', paddingBottom: 4 }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Entry2Col({ leftTop, rightTop, leftBottom, rightBottom }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', columnGap: 12, rowGap: 2, alignItems: 'baseline' }}>
      <div style={{ fontWeight: 900 }}>{leftTop}</div>
      <div style={{ color: '#555', textAlign: 'right', whiteSpace: 'nowrap' }}>{rightTop}</div>
      <div style={{ fontStyle: 'italic', fontSize: 11 }}>{leftBottom}</div>
      <div style={{ color: '#555', textAlign: 'right', whiteSpace: 'nowrap', fontSize: 11 }}>{rightBottom}</div>
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

export default function TwoColumnProfessional({ data, order, enabled, settings }) {
  const spacing = settings?.spacing || 'normal'
  const font = settings?.font || 'sans'
  const fontFamily = font === 'serif' ? 'Times New Roman, Times, serif' : 'Inter, Arial, sans-serif'

  const leftBlocks = {
    skills: data.skills?.length ? (
      <Section
        title="Skills"
        children={
          <div style={{ display: 'grid', gap: 8 }}>
            {data.skills.map((s, idx) => (
              <div key={idx}>
                <div style={{ fontWeight: 900 }}>{s.category}</div>
                <div style={{ fontSize: 11 }}>{(s.items || []).join(', ')}</div>
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

  const rightBlocks = {
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
        title="Experience"
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
  }

  const leftKeys = ['skills', 'certifications', 'publications']
  const rightKeys = ['experience', 'projects', 'education']

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

      <div style={{ height: 12 }} />

      <div style={{ display: 'grid', gridTemplateColumns: '30% 70%', gap: 16 }}>
        <div>
          {leftKeys
            .filter((k) => (enabled ? enabled[k] !== false : true))
            .map((k) => leftBlocks[k])
            .filter(Boolean)}
        </div>
        <div>
          {(Array.isArray(order) && order.length ? order : rightKeys)
            .filter((k) => rightKeys.includes(k))
            .filter((k) => (enabled ? enabled[k] !== false : true))
            .map((k) => rightBlocks[k])
            .filter(Boolean)}
        </div>
      </div>
    </div>
  )
}
