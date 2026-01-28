import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home as HomeIcon, Info, Menu, X, Wrench } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="nav">
      <div className="container nav-inner">
        <div className="row" style={{ gap: 10 }}>
          <div className="logo">Student Utility Hub</div>
          <span className="badge">All frontend • Client-side</span>
        </div>

        <nav className="nav-links" aria-label="Primary">
          <div className="row nav-desktop" style={{ flexWrap: 'nowrap' }}>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              <span className="row" style={{ gap: 8, flexWrap: 'nowrap' }}>
                <HomeIcon size={16} aria-hidden="true" />
                <span>Home</span>
              </span>
            </NavLink>
            <NavLink to="/tools" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              <span className="row" style={{ gap: 8, flexWrap: 'nowrap' }}>
                <Wrench size={16} aria-hidden="true" />
                <span>Tools</span>
              </span>
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              <span className="row" style={{ gap: 8, flexWrap: 'nowrap' }}>
                <Info size={16} aria-hidden="true" />
                <span>About</span>
              </span>
            </NavLink>
          </div>

          <div className="row" style={{ gap: 10, flexWrap: 'nowrap' }}>
            <button
              type="button"
              className="nav-hamburger nav-mobile"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="container"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="nav-mobile-panel">
              <div className="section" style={{ padding: 10 }}>
                <div className="grid" style={{ gap: 8 }}>
                  <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                    <span className="row" style={{ gap: 8, flexWrap: 'nowrap' }}>
                      <HomeIcon size={16} aria-hidden="true" />
                      <span>Home</span>
                    </span>
                  </NavLink>
                  <NavLink to="/tools" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                    <span className="row" style={{ gap: 8, flexWrap: 'nowrap' }}>
                      <Wrench size={16} aria-hidden="true" />
                      <span>Tools</span>
                    </span>
                  </NavLink>
                  <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                    <span className="row" style={{ gap: 8, flexWrap: 'nowrap' }}>
                      <Info size={16} aria-hidden="true" />
                      <span>About</span>
                    </span>
                  </NavLink>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
