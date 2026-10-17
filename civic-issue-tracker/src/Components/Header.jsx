
import React from 'react'
import { Container, Navbar, Nav, Button } from 'react-bootstrap'
import { FaLandmark, FaUserCircle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'

function Header({ insideLogin }) {
  const navigate = useNavigate()

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
            <Button
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: '#176B52',
                border: 'none',
                padding: '9px 20px',
                borderRadius: '8px',
                boxShadow: 'none'
              }}
            >
              Get Started
            </Button>

            <FaUserCircle
              size={30}
              color="#176B52"
              title="Login"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
