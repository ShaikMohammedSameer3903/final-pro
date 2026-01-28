import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Button from '../components/Button.jsx'

export default function Home() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const orb1Y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 60])
  const orb2Y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -45])
  const navigate = useNavigate()
  const [toolQuery, setToolQuery] = useState('')

  return (
    <div className="container">
      <div className="card hero premium-border">
        <motion.div className="parallax-orb" style={{ left: -180, top: -220, y: orb1Y }} />
        <motion.div
          className="parallax-orb"
          style={{ right: -220, top: -260, y: orb2Y, background: 'radial-gradient(circle at 30% 30%, rgba(var(--accent), 0.25), transparent 60%)' }}
        />

        <div className="section">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="hero-title">
              Student Utility Hub
              <span className="gradient-text"> for students.</span>
            </div>
            <p className="hero-sub" style={{ maxWidth: 720, marginTop: 10 }}>
              Build your resume and handle PDFs, images, and media — privately in your browser.
            </p>
          </motion.div>

          <div style={{ height: 18 }} />

          <motion.div
            className="row"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
          >
            <Link to="/tools">
              <Button>Explore Tools</Button>
            </Link>
            <Link to="/tools/resume-builder">
              <Button variant="secondary">Try Resume Builder</Button>
            </Link>
          </motion.div>

          <div style={{ height: 14 }} />

          <div className="grid" style={{ gap: 10, maxWidth: 720 }}>
            <input
              className="input"
              placeholder="Search tools (resume, image, pdf, video…)"
              value={toolQuery}
              onChange={(e) => setToolQuery(e.target.value)}
              aria-label="Search tools"
            />
            <div className="row">
              <Button variant="secondary" onClick={() => navigate(`/tools?query=${encodeURIComponent(toolQuery)}`)}>
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 14 }} />

      <motion.div
        className="grid cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
      >
        {[
          { title: 'ATS-friendly resumes', body: 'LaTeX-style templates, clean layout, print-ready export.' },
          { title: 'PDF & image tools', body: 'Compress, merge, convert, resize, and export.' },
          { title: 'Frontend-only privacy', body: 'Files stay on your device. No uploads.' },
          { title: 'Works offline-ish', body: 'Many tools still work even with weak internet.' },
        ].map((b) => (
          <motion.div key={b.title} className="card" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
            <div className="section">
              <div className="h2" style={{ margin: 0 }}>{b.title}</div>
              <p className="p" style={{ marginTop: 8 }}>{b.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div style={{ height: 14 }} />

      <motion.div className="card" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.45, ease: 'easeOut' }}>
        <div className="section">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="h2" style={{ margin: 0 }}>Trust & credibility</div>
              <p className="p" style={{ marginTop: 8, maxWidth: 720 }}>
                Frontend only. No file uploads. No sign-in. Runs in your browser.
              </p>
            </div>
            <span className="badge">Safe by design</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
