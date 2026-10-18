import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link to="/" className="brand brand-sm">
          Civic<span>Track</span>
        </Link>
        <small>© {new Date().getFullYear()} · Report it, back it, track it.</small>
      </div>
    </footer>
  )
}

export default Footer
