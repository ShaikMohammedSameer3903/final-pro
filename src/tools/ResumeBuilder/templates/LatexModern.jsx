import { Mail, Phone, Github, Linkedin, Globe } from 'lucide-react'

function nonEmptyLines(text) {
  return (text || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function Section({ title, children, color }) {
  if (!children) return null
  return (
    <section style={{ marginTop: 14 }}>
      <h2
        style={{
          margin: '0 0 8px',
          fontSize: 13,
          fontWeight: 900,
          color,
          borderLeft: `3px solid ${color}`,
          paddingLeft: 10,
          letterSpacing: 0.2,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function Entry2Col({ leftTop, rightTop, leftBottom, rightBottom, muted = '#555' }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', columnGap: 12, rowGap: 2, alignItems: 'baseline' }}>
      <div style={{ fontWeight: 900 }}>{leftTop}</div>
      <div style={{ color: muted, textAlign: 'right', whiteSpace: 'nowrap' }}>{rightTop}</div>
      <div style={{ fontStyle: 'italic', fontSize: 11 }}>{leftBottom}</div>
      <div style={{ color: muted, textAlign: 'right', whiteSpace: 'nowrap', fontSize: 11 }}>{rightBottom}</div>
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

function IconRow({ data, color }) {
  const p = data.personal
  const items = [
    p.email ? { icon: Mail, value: p.email } : null,
    p.phone ? { icon: Phone, value: p.phone } : null,
    p.github ? { icon: Github, value: p.github } : null,
    p.linkedin ? { icon: Linkedin, value: p.linkedin } : null,
    p.website ? { icon: Globe, value: p.website } : null,
  ].filter(Boolean)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 11, color: '#222', marginTop: 8 }}>
      {items.map((it) => {
        const Icon = it.icon
        return (
          <div key={it.value} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon size={14} color={color} aria-hidden="true" />
            <span>{it.value}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function LatexModern({ data, order, enabled, settings }) {
  const color = settings?.primaryColor || '#004f90'
  const spacing = settings?.spacing || 'normal'
  const font = settings?.font || 'sans'

  const fontFamily = font === 'serif' ? 'Times New Roman, Times, serif' : 'Inter, Arial, sans-serif'

  const blocks = {
    education: data.education?.length ? (
      <Section
        title="EDUCATION"
        color={color}
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
        title="EXPERIENCE"
        color={color}
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
        title="PROJECTS"
        color={color}
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
    publications: data.publications?.length ? (
      <Section
        title="PUBLICATIONS"
        color={color}
        children={
          <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
            {data.publications.map((p, idx) => (
              <li key={idx} style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 900 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: '#333' }}>{[p.authors, p.venue, p.year].filter(Boolean).join(' • ')}</div>
              </li>
            ))}
          </ul>
        }
      />
    ) : null,
    skills: data.skills?.length ? (
      <Section
        title="SKILLS"
        color={color}
        children={
          <div style={{ display: 'grid', gap: 6 }}>
            {data.skills.map((s, idx) => (
              <div key={idx}>
                <span style={{ fontWeight: 900 }}>{s.category}:</span> <span>{(s.items || []).join(', ')}</span>
              </div>
            ))}
          </div>
        }
      />
    ) : null,
    certifications: data.certifications?.length ? (
      <Section
        title="CERTIFICATIONS"
        color={color}
        children={
          <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
            {data.certifications.map((c, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                <span style={{ fontWeight: 900 }}>{c.name}</span>
                {c.issuer ? <span> — {c.issuer}</span> : null}
                {c.year ? <span> ({c.year})</span> : null}
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
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>{data.personal?.name || 'Your Name'}</h1>
        <IconRow data={data} color={color} />
      </header>

      {keys
        .filter((k) => (enabled ? enabled[k] !== false : true))
        .map((k) => blocks[k])
        .filter(Boolean)}
    </div>
  )
}
