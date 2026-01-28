export default function ResumePreview({ children }) {
  return (
    <div
      style={{
        width: '100%',
        maxHeight: '74vh',
        overflow: 'auto',
        borderRadius: 12,
        border: '1px solid rgba(0,0,0,0.08)',
        background: 'rgba(0,0,0,0.02)',
        padding: 10,
      }}
    >
      {children}
    </div>
  )
}
