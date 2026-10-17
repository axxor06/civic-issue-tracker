
import React from 'react'
import { Container, Button } from 'react-bootstrap'
import {
  FaArrowRight,
  FaBullhorn,
  FaUsers,
  FaCheckCircle
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Header from '../Components/Header'
import Footer from '../Components/Footer'

function Landing() {
  const navigate = useNavigate()

  return (
    <>
      <Header />

      <main
        style={{
          background: 'linear-gradient(135deg, #f0f9f5, #ffffff)',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container className="py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span
                style={{
                  backgroundColor: '#d9f2e6',
                  color: '#176B52',
                  padding: '8px 14px',
                  borderRadius: '30px',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                BUILD A BETTER COMMUNITY
              </span>

              <h1
                style={{
                  fontSize: 'clamp(38px, 5vw, 62px)',
                  fontWeight: '800',
                  color: '#212529',
                  lineHeight: '1.15',
                  marginTop: '25px'
                }}
              >
                Your City. Your Voice.{' '}
                <span style={{ color: '#176B52' }}>Your Change.</span>
              </h1>

              <p
                style={{
                  fontSize: '18px',
                  color: '#6c757d',
                  lineHeight: '1.8',
                  marginTop: '20px',
                  maxWidth: '600px'
                }}
              >
                Report civic issues, track their progress, and help make your
                community cleaner, safer, and better for everyone.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <Button
                  onClick={() => navigate('/login')}
                  style={{
                    backgroundColor: '#176B52',
                    border: 'none',
                    padding: '13px 24px',
                    borderRadius: '8px'
                  }}
                >
                  Get Started <FaArrowRight className="ms-2" />
                </Button>

                <Button
                  variant="outline-success"
                  href="#about"
                  style={{
                    padding: '13px 24px',
                    borderRadius: '8px'
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="col-lg-5" id="features">
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '35px',
                  borderRadius: '20px',
                  boxShadow: '0 12px 40px rgba(23,107,82,0.10)'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#e2f4eb',
                    width: '60px',
                    height: '60px',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}
                >
                  <FaBullhorn size={28} color="#176B52" />
                </div>

                <h3 style={{ fontWeight: '700', color: '#212529' }}>
                  Make Your Voice Heard
                </h3>

                <p style={{ color: '#6c757d', lineHeight: '1.7' }}>
                  Help authorities identify local problems and take action
                  where it matters most.
                </p>

                <hr style={{ borderColor: '#e9ecef', margin: '25px 0' }} />

                <div className="d-flex align-items-center gap-3 mb-3">
                  <FaCheckCircle color="#176B52" size={20} />
                  <span>Report local civic issues</span>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <FaUsers color="#176B52" size={20} />
                  <span>Support your community</span>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <FaCheckCircle color="#176B52" size={20} />
                  <span>Track issue progress</span>
                </div>
              </div>
            </div>
          </div>

          <div id="about" className="text-center mt-5 pt-4">
            <p style={{ color: '#6c757d', marginBottom: 0 }}>
              Together, we can make our neighbourhood a better place.
            </p>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  )
}

export default Landing
