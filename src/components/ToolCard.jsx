import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, FileText, GraduationCap, Image as ImageIcon, LayoutTemplate, PlayCircle } from 'lucide-react'
import Button from './Button.jsx'

export default function ToolCard({ tool }) {
  const Icon =
    tool.tag === 'PDF'
      ? FileText
      : tool.tag === 'Document'
        ? LayoutTemplate
        : tool.tag === 'Image'
          ? ImageIcon
          : tool.tag === 'Video'
            ? PlayCircle
            : tool.tag === 'Resume'
              ? LayoutTemplate
              : tool.tag === 'Study'
                ? GraduationCap
                : FileText

  return (
    <motion.div
      className={`toolcard card ${tool.featured ? 'premium-border' : ''}`.trim()}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
    >
      <Link to={tool.path} style={{ display: 'block' }}>
        <div className="section">
          <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
            <div
              className={tool.featured ? 'badge' : 'kbd'}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                flex: '0 0 auto',
              }}
              aria-hidden="true"
            >
              <Icon size={18} />
            </div>

            <div style={{ minWidth: 0, flex: '1 1 auto' }}>
              <div className="row" style={{ justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                <div className="h2" style={{ marginBottom: 4, lineHeight: 1.2 }}>
                  {tool.name}
                </div>
                {tool.tag ? <span className={tool.featured ? 'badge' : 'kbd'}>{tool.tag}</span> : null}
              </div>
              <div className="p" style={{ marginTop: 2 }}>
                {tool.description}
              </div>

              <div style={{ height: 14 }} />

              <Button variant={tool.featured ? 'primary' : 'secondary'}>
                Open
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
