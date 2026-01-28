import Button from './Button.jsx'

export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal card">
        <div className="modal-head">
          <div className="modal-title">{title}</div>
          <Button variant="ghost" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-foot">
          {footer ?? (
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
