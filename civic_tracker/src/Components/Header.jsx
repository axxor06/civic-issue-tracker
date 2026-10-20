import { useEffect, useRef, useState } from 'react'
import { Container, Navbar, Nav, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap'
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
          <Navbar.Brand as={Link} to={'/'}
            style={{ fontSize: '20px', fontWeight: '700', color: 'black', display: 'flex', alignItems: 'center' }} >
            <img width={'50px'} height={'50px'} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfBxkIlIxwNyveMs8LN3oY4eEzKX6rMeSFpCZSuM3kk9MfHZZbegMZ68g&s=10" alt="logo" />
            Civic-Tracker
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="civic-navbar"
            style={{ border: 'none', boxShadow: 'none' }}
          />

          <Navbar.Collapse id="civic-navbar" className="justify-content-end">
            <Nav className="align-items-lg-center" style={{ gap: '20px' }}>
              <Nav.Link as={Link} to="/" style={{ color: 'black', fontWeight: '500' }}> Home </Nav.Link>


              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip
                    id="about-tooltip"
                    style={{
                      "--bs-tooltip-max-width": "500px",
                      maxWidth: "500px",
                      width: "500px",
                      "--bs-tooltip-bg": "#ffffff",
                      "--bs-tooltip-color": "#000000",
                      opacity: 1
                    }}
                  >
                    <div
                      style={{
                        width: "460px",
                        maxWidth: "100%",
                        padding: "10px 15px",
                        textAlign: "justify",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        fontSize: "15px",
                        lineHeight: "1.4"
                      }}
                    >
                      Civic-Tracker is a web application that helps citizens
                      report public issues such as damaged roads, garbage accumulation,
                      and broken streetlights. Users can submit complaints and track
                      their status easily. Administrators can manage reported issues
                      and update their progress. <br></br>Our goal is to improve communication
                      between citizens and local authorities and create a cleaner,
                      safer community.
                    </div>
                  </Tooltip>
                }
              >
                <Nav.Link
                  as={Link}
                  to="/about"
                  style={{ color: "black", fontWeight: 500 }}
                >
                  About
                </Nav.Link>
              </OverlayTrigger>


              <Nav.Link as={Link} to="/dashboard" style={{ color: 'black', fontWeight: '500' }}>Community </Nav.Link>


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