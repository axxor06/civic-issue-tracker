import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import { getLoggedUser, logoutUser } from '../utils/auth'

function Header() {
  const navigate = useNavigate()
  const user = getLoggedUser()

  const [hidden, setHidden] = useState(false) // hide on scroll down
  const [menuOpen, setMenuOpen] = useState(false) // mobile menu
  const [accountOpen, setAccountOpen] = useState(false)
  const lastY = useRef(0)
  const accountRef = useRef(null)

  // hide when scrolling down, show when scrolling up or near the top
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const diff = y - lastY.current

      if (y < 60) {
        setHidden(false)
        lastY.current = y
      } else if (diff > 8) {
        setHidden(true)
        setMenuOpen(false)
        setAccountOpen(false)
        lastY.current = y
      } else if (diff < -8) {
        setHidden(false)
        lastY.current = y
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close account menu when clicking outside
  useEffect(() => {
    if (!accountOpen) return

    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false)
      }
    }

    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [accountOpen])

  const closeAll = () => {
    setMenuOpen(false)
    setAccountOpen(false)
  }

  const handleLogout = () => {
    logoutUser()
    closeAll()
    navigate('/login')
  }

  const navClass = ({ isActive }) => (isActive ? 'active' : '')

  return (
    <>
      {/* thin strip at the very top: hover it to bring the header back */}
      <div
        className={`header-hotspot ${hidden ? 'active' : ''}`}
        onMouseEnter={() => setHidden(false)}
      />

      <header
        className={`site-header ${hidden ? 'is-hidden' : ''}`}
        onFocus={() => setHidden(false)}
      >
        <div className="header-inner">
          <Link to="/" className="brand" onClick={closeAll}>
            Civic<span>Track</span>
          </Link>

          <button
            type="button"
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`}>
            {user ? (
              <>
                <NavLink to="/dashboard" className={navClass} onClick={closeAll}>
                  Community
                </NavLink>
                <NavLink to="/report-issue" className={navClass} onClick={closeAll}>
                  Report an issue
                </NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin" className={navClass} onClick={closeAll}>
                    Manage
                  </NavLink>
                )}

                <div className="account" ref={accountRef}>
                  <button
                    type="button"
                    className="account-btn"
                    aria-expanded={accountOpen}
                    onClick={() => setAccountOpen(!accountOpen)}
                  >
                    {user.name} <span aria-hidden="true">▾</span>
                  </button>

                  {accountOpen && (
                    <div className="account-menu">
                      <Link to="/profile" onClick={closeAll}>
                        Profile
                      </Link>
                      <button type="button" onClick={handleLogout}>
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/#how" onClick={closeAll}>How it works</Link>
                <Link to="/#about" onClick={closeAll}>About</Link>
                <Link to="/login" onClick={closeAll}>Log in</Link>
                <Link to="/register" className="nav-cta" onClick={closeAll}>
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header
