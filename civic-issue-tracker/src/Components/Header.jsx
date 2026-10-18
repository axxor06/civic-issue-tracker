import React, { useState } from 'react'
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap'
import { FaLandmark, FaUserCircle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { getLoggedUser, logoutUser } from '../utils/auth'

function Header({ insideLogin }) {
  const navigate = useNavigate()
  const [loggedUser, setLoggedUser] = useState(getLoggedUser())

  const handleLogout = () => {
    logoutUser()
    setLoggedUser(null)
    navigate('/login')
  }

  return (
    <Navbar
      expand="lg"
      bg="white"
      style={{
        padding: '16px 0',
        border: 'none',
        boxShadow: 'none',
        outline: 'none'
      }}
    >
      <Container>
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
          Civic<span style={{ color: '#212529' }}>Track</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="civic-navbar"
          style={{ border: 'none', boxShadow: 'none' }}
        />

        <Navbar.Collapse id="civic-navbar">
          {!insideLogin && (
            <Nav className="mx-auto" style={{ gap: '20px' }}>
              <Nav.Link
                as={Link}
                to="/"
                style={{ color: '#343a40', fontWeight: '500' }}
              >
                Home
              </Nav.Link>

              <Nav.Link
                href="/#about"
                style={{ color: '#343a40', fontWeight: '500' }}
              >
                About
              </Nav.Link>

              <Nav.Link
                href="/#features"
                style={{ color: '#343a40', fontWeight: '500' }}
              >
                Features
              </Nav.Link>
            </Nav>
          )}

          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0 ms-lg-auto">
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

                  <Dropdown.Item
                    onClick={handleLogout}
                    className="text-danger"
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              !insideLogin && (
                <div
                  className="d-flex align-items-center gap-2"
                  onClick={() => navigate('/login')}
                  style={{
                    cursor: 'pointer',
                    color: '#176B52',
                    fontWeight: '500'
                  }}
                >
                  <FaUserCircle size={30} />
                  <span>Login</span>
                </div>
              )
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header