import { useEffect, useRef, useState } from 'react'
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap'
import { FaLandmark, FaUserCircle } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getLoggedUser, logoutUser } from '../utils/auth'

function Header() {
  const navigate = useNavigate()
  useLocation() // re-render the header on every page change so login / logout shows straight away
  const loggedUser = getLoggedUser()

  const [hidden, setHidden] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const lastY = useRef(0)

  // hide the header when scrolling down, show it when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      const diff = y - lastY.current

      if (y < 60) {
        setHidden(false)
        lastY.current = y
      } else if (diff > 8) {
        setHidden(true)
        setExpanded(false)
        lastY.current = y
      } else if (diff < -8) {
        setHidden(false)
        lastY.current = y
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  const linkStyle = { color: '#343a40', fontWeight: '500' }

  return (
    <>
      {/* thin strip at the top of the screen: move the mouse here to bring the header back */}
      <div
        className={`header-hotspot ${hidden ? 'active' : ''}`}
        onMouseEnter={() => setHidden(false)}
      />

      <Navbar
        expand="lg"
        bg="white"
        sticky="top"
        expanded={expanded}
        onToggle={setExpanded}
        onSelect={() => setExpanded(false)}
        onFocus={() => setHidden(false)}
        className={`site-header ${hidden ? 'is-hidden' : ''}`}
        style={{ padding: '16px 0' }}
      >
        <Container fluid className="px-3 px-lg-5">
          <Navbar.Brand
            as={Link}
            to="/"
            style={{
              fontSize: '23px',
              fontWeight: '700',
              color: '#176B52',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <FaLandmark size={28} />
            <span>
              Civic<span style={{ color: '#212529' }}>Track</span>
            </span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="civic-navbar"
            style={{ border: 'none', boxShadow: 'none' }}
          />

          <Navbar.Collapse id="civic-navbar" className="justify-content-end">
            <Nav className="align-items-lg-center" style={{ gap: '20px' }}>
              <Nav.Link as={Link} to="/" style={linkStyle}>
                Home
              </Nav.Link>

              <Nav.Link href="/#about" style={linkStyle}>
                About
              </Nav.Link>

              <Nav.Link as={Link} to="/dashboard" style={linkStyle}>
                Community
              </Nav.Link>

              {loggedUser?.role === 'admin' && (
                <Nav.Link as={Link} to="/admin" style={linkStyle}>
                  Manage
                </Nav.Link>
              )}
            </Nav>

            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0 ms-lg-4">
              {loggedUser ? (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    className="d-flex align-items-center gap-2"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                      color: '#176B52',
                      fontWeight: '500'
                    }}
                  >
                    <FaUserCircle size={30} />
                    <span>{loggedUser.name}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate('/profile')}>
                      View Profile
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div
                  className="d-flex align-items-center gap-2"
                  onClick={() => navigate('/login')}
                  style={{ cursor: 'pointer', color: '#176B52', fontWeight: '500' }}
                >
                  <FaUserCircle size={30} />
                  <span>Login</span>
                </div>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default Header