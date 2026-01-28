import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/Button.jsx'

export default function NotFound() {
  return (
    <div className="container">
      <div className="card hero premium-border">
        <div className="section">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
            <div className="hero-title">Page not found</div>
            <p className="hero-sub" style={{ marginTop: 10 }}>The page you’re looking for doesn’t exist.</p>
            <div style={{ height: 16 }} />
            <Link to="/">
              <Button className="shine">Go Home</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
