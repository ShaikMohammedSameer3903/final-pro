export default function Loader({ label = 'Working…' }) {
  return (
    <div className="loader">
      <div className="spinner" aria-hidden="true" />
      <div className="loader-label">{label}</div>
    </div>
  )
}
