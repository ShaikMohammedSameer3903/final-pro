import ToolCard from '../components/ToolCard.jsx'
import { TOOLS } from '../utils/constants.js'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Tools() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('query') || '')
  const [activeTag, setActiveTag] = useState('All')

  const tags = useMemo(() => {
    const set = new Set(['All'])
    for (const t of TOOLS) set.add(t.tag || 'Other')
    return Array.from(set)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TOOLS.filter((t) => {
      const tag = t.tag || 'Other'
      if (activeTag !== 'All' && tag !== activeTag) return false
      if (!q) return true
      const hay = `${t.name} ${t.description} ${tag}`.toLowerCase()
      return hay.includes(q)
    })
  }, [query, activeTag])

  const grouped = useMemo(() => {
    const map = new Map()
    for (const t of filtered) {
      const key = t.tag || 'Other'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(t)
    }
    const order = ['Resume', 'Image', 'PDF', 'Document', 'Video', 'Study', 'Other']
    const entries = Array.from(map.entries()).map(([k, items]) => {
      const sorted = [...items].sort((a, b) => {
        const af = a.featured ? 1 : 0
        const bf = b.featured ? 1 : 0
        if (af !== bf) return bf - af
        return a.name.localeCompare(b.name)
      })
      return [k, sorted]
    })
    entries.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    return entries
  }, [filtered])

  return (
    <div className="container">
      <div className="card hero" style={{ marginBottom: 14 }}>
        <div className="section">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
            <div className="hero-title">
              Tools that
              <span className="gradient-text"> save time.</span>
            </div>
            <p className="hero-sub" style={{ maxWidth: 740, marginTop: 10 }}>
              Everything runs client-side. Your files stay on your device.
            </p>
          </motion.div>

          <div style={{ height: 12 }} />

          <div className="grid" style={{ gap: 10 }}>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: 10 }}>
              <input
                className="input"
                placeholder="Search tools (e.g. image, pdf, resume, video)…"
                value={query}
                onChange={(e) => {
                  const v = e.target.value
                  setQuery(v)
                  const next = new URLSearchParams(searchParams)
                  if (v) next.set('query', v)
                  else next.delete('query')
                  setSearchParams(next, { replace: true })
                }}
                aria-label="Search tools"
              />
            </div>

            <div className="row" style={{ gap: 8 }}>
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={t === activeTag ? 'badge' : 'kbd'}
                  onClick={() => setActiveTag(t)}
                  aria-pressed={t === activeTag}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {grouped.length ? (
        <div className="grid" style={{ gap: 16 }}>
          {grouped.map(([tag, items]) => (
            <div key={tag}>
              {activeTag === 'All' ? (
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                  <div className="h2" style={{ margin: 0 }}>{tag}</div>
                  <span className="badge">{items.length}</span>
                </div>
              ) : null}

              <motion.div
                className="grid cols-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
                }}
              >
                {items.map((t) => (
                  <motion.div key={t.id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                    <ToolCard tool={t} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="section">
            <div className="muted">No tools match your search.</div>
          </div>
        </div>
      )}
    </div>
  )
}
