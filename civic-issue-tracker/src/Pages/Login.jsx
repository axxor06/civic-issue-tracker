import React, { useState } from 'react'
import { Container, Form, Button, Card } from 'react-bootstrap'
import {
  FaLandmark,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../utils/api'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { saveLoggedUser } from '../utils/auth'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const response = await api.get('/users')

      const user = response.data.find(
        (item) =>
          item.email.toLowerCase() === email.trim().toLowerCase() &&
          item.password === password
      )

      if (!user) {
        toast.error('Invalid email or password!')
        return
      }

      saveLoggedUser(user)

      toast.success('Login successful!')

      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch {
      toast.error('Unable to log in. Make sure JSON Server is running!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header insideLogin />

      <main
        style={{
          minHeight: '85vh',
          background: 'linear-gradient(135deg, #f0f9f5, #ffffff)',
          padding: '50px 15px'
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

                    <h2 className="fw-bold">Welcome to Civic Track!</h2>
                    <p className="text-secondary">Sign in to continue</p>
                  </div>

                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>

                      <div className="d-flex">
                        <span
                          className="d-flex align-items-center px-3"
                          style={{
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
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          style={{
                            padding: '12px',
                            borderRadius: '0 8px 8px 0'
                          }}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>

                      <div className="d-flex">
                        <span
                          className="d-flex align-items-center px-3"
                          style={{
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
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          style={{ padding: '12px', borderRadius: 0 }}
                        />

                        <Button
                          type="button"
                          variant="light"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                          style={{
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

                    <Button
                      type="submit"
                      className="w-100 mt-3"
                      disabled={loading}
                      style={{
                        backgroundColor: '#176B52',
                        border: 'none',
                        padding: '13px',
                        borderRadius: '8px'
                      }}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </Form>

                  <p className="text-center mt-4 mb-0">
                    Don't have an account? <Link to="/register">Register</Link>
                  </p>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  )
}

export default Login
