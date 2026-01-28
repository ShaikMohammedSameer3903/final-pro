import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="container">
      <div className="card hero premium-border">
        <div className="section">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
            <div className="hero-title">About</div>
            <p className="hero-sub" style={{ maxWidth: 820, marginTop: 10 }}>
              Student Utility Hub is a frontend-only utility suite. Files are processed in your browser and drafts/history are stored in localStorage.
            </p>
          </motion.div>

          <div style={{ height: 14 }} />

          <div className="grid" style={{ gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: 14 }}>
            <div className="card" style={{ boxShadow: 'none' }}>
              <div className="section" style={{ padding: 14 }}>
                <div className="h2" style={{ margin: 0 }}>Privacy</div>
                <p className="p" style={{ marginTop: 8 }}>
                  Your files are not uploaded to a server. Everything runs locally.
                </p>
              </div>
            </div>
            <div className="card" style={{ boxShadow: 'none' }}>
              <div className="section" style={{ padding: 14 }}>
                <div className="h2" style={{ margin: 0 }}>Limitations (honest)</div>
                <p className="p" style={{ marginTop: 8 }}>
                  PDF compression is a best-effort re-save client-side. True stream-level optimization is complex without a backend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
