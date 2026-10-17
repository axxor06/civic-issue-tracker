
import React, { useState } from 'react'
import { Container, Form, Button, Card } from 'react-bootstrap'
import {
  FaLandmark,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa'
import Header from '../Components/Header'
import Footer from '../Components/Footer'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return
    }

    setError('Login API is not connected yet.')
  }

  return (
    <>
      <Header insideLogin />

      <main
        style={{
          minHeight: '90vh',
          background: 'linear-gradient(135deg, #f0f9f5, #ffffff)',
          padding: '50px 15px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container>
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-7 col-lg-5">
              <Card
                style={{
                  border: '1px solid #e4eee8',
                  borderRadius: '20px',
                  padding: '25px',
                  boxShadow: '0 12px 35px rgba(23,107,82,0.09)'
                }}
              >
                <Card.Body>
                  <div className="text-center mb-4">
                    <div
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '20px',
                        backgroundColor: '#e2f4eb',
                        color: '#176B52',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px'
                      }}
                    >
                      <FaLandmark size={32} />
                    </div>

                    <h2
                      style={{
                        fontWeight: '800',
                        color: '#212529'
                      }}
                    >
                      Welcome to Civic Track!
                    </h2>

                    <p
                      style={{
                        color: '#6c757d',
                        marginBottom: '10px'
                      }}
                    >
                      Sign in to continue
                    </p>
                  </div>

                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: '600' }}>
                        Email Address
                      </Form.Label>

                      <div className="d-flex align-items-center">
                        <span
                          style={{
                            padding: '12px',
                            backgroundColor: '#f8faf9',
                            border: '1px solid #ced4da',
                            borderRight: 'none',
                            borderRadius: '8px 0 0 8px',
                            color: '#176B52'
                          }}
                        >
                          <FaEnvelope />
                        </span>

                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                          }}
                          required
                          style={{
                            padding: '12px',
                            borderRadius: '0 8px 8px 0'
                          }}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: '600' }}>
                        Password
                      </Form.Label>

                      <div className="d-flex align-items-center">
                        <span
                          style={{
                            padding: '12px',
                            backgroundColor: '#f8faf9',
                            border: '1px solid #ced4da',
                            borderRight: 'none',
                            borderRadius: '8px 0 0 8px',
                            color: '#176B52'
                          }}
                        >
                          <FaLock />
                        </span>

                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            setError('')
                          }}
                          required
                          style={{
                            padding: '12px',
                            borderRadius: 0
                          }}
                        />

                        <Button
                          type="button"
                          variant="light"
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            padding: '12px',
                            border: '1px solid #ced4da',
                            borderLeft: 'none',
                            borderRadius: '0 8px 8px 0',
                            color: '#176B52'
                          }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </div>
                    </Form.Group>

                    {error && (
                      <p
                        role="alert"
                        style={{
                          color: '#b42318',
                          fontSize: '14px',
                          marginTop: '15px'
                        }}
                      >
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-100 mt-3"
                      style={{
                        backgroundColor: '#176B52',
                        border: 'none',
                        padding: '13px',
                        borderRadius: '8px',
                        fontWeight: '600'
                      }}
                    >
                      Login
                    </Button>
                  </Form>
                </Card.Body>
              </Card>

              <p
                className="text-center mt-4"
                style={{
                  color: '#6c757d',
                  fontSize: '13px'
                }}
              >
                Civic Track · Building better communities together
              </p>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  )
}

export default Login
