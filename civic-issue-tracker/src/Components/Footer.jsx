
import React from 'react'
import { Container } from 'react-bootstrap'
import { FaLandmark } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e4eee8',
        padding: '20px 0'
      }}
    >
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <Link
            to="/"
            style={{
              color: '#176B52',
              fontWeight: '700',
              fontSize: '18px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaLandmark />
            Civic<span style={{ color: '#212529' }}>Track</span>
          </Link>

          <p
            style={{
              color: '#6c757d',
              fontSize: '13px',
              margin: 0,
              textAlign: 'center'
            }}
          >
            © {new Date().getFullYear()} Civic Track. Building better communities.
          </p>

          <div className="d-flex gap-3">
            <Link
              to="/"
              style={{ color: '#6c757d', fontSize: '13px', textDecoration: 'none' }}
            >
              Home
            </Link>

            <Link
              to="/login"
              style={{ color: '#6c757d', fontSize: '13px', textDecoration: 'none' }}
            >
              Login
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
