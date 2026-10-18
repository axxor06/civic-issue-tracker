
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { FaLandmark, FaHeart, FaArrowUp } from 'react-icons/fa'

function Footer() {
  const location = useLocation()
  const currentYear = new Date().getFullYear()

  const isLandingPage = location.pathname === '/'

  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5eee9',
        color: '#495057'
      }}
    >
      {isLandingPage && (
        <div
          style={{
            backgroundColor: '#176B52',
            color: '#ffffff',
            padding: '35px 15px'
          }}
        >
          <Container>
            <Row className="align-items-center g-3">
              <Col md={8}>
                <h4 className="fw-bold mb-2">
                  Together, Let's Improve Our Community
                </h4>
                <p className="mb-0" style={{ color: '#e1f2e9' }}>
                  Report civic issues, raise awareness, and help make your
                  neighbourhood a better place.
                </p>
              </Col>

              <Col md={4} className="text-md-end">
                <Link
                  to="/login"
                  className="btn"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#176B52',
                    borderRadius: '8px',
                    padding: '11px 20px',
                    fontWeight: '600'
                  }}
                >
                  Get Started
                </Link>
              </Col>
            </Row>
          </Container>
        </div>
      )}

      <Container className="py-4">
        <Row className="align-items-center gy-3">
          <Col md={6}>
            <Link
              to="/"
              className="d-inline-flex align-items-center gap-2 text-decoration-none"
              style={{
                color: '#176B52',
                fontSize: '21px',
                fontWeight: '700'
              }}
            >
              <FaLandmark size={25} />
              Civic<span style={{ color: '#212529' }}>Track</span>
            </Link>

            {isLandingPage && (
              <p className="text-secondary small mt-2 mb-0">
                Your City. Your Voice. Your Change.
              </p>
            )}
          </Col>

          <Col md={6}>
            <div className="d-flex flex-wrap align-items-center justify-content-md-end gap-3">
              {isLandingPage && (
                <>
                  <Link
                    to="/"
                    className="text-decoration-none small"
                    style={{ color: '#495057' }}
                  >
                    Home
                  </Link>

                  <a
                    href="/#about"
                    className="text-decoration-none small"
                    style={{ color: '#495057' }}
                  >
                    About
                  </a>

                  <a
                    href="/#features"
                    className="text-decoration-none small"
                    style={{ color: '#495057' }}
                  >
                    Features
                  </a>
                </>
              )}

              <button
                type="button"
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
                aria-label="Back to top"
                className="btn btn-sm d-inline-flex align-items-center gap-2"
                style={{
                  color: '#176B52',
                  border: '1px solid #dce9e2',
                  borderRadius: '8px'
                }}
              >
                <FaArrowUp size={12} />
                Top
              </button>
            </div>
          </Col>
        </Row>

        <hr style={{ borderColor: '#e5eee9', margin: '22px 0 16px' }} />

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <small className="text-secondary">
            © {currentYear} CivicTrack. All rights reserved.
          </small>

          <small className="text-secondary d-flex align-items-center gap-1">
            Made for better communities <FaHeart color="#176B52" size={12} />
          </small>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
