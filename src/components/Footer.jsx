export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="muted">© {year} Student Utility Hub</div>
        <div className="muted">Built with React + Vite</div>
      </div>
    </footer>
  )
}
