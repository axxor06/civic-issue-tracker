
import React, { useState } from 'react'
import { Container, Form, Button, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../Components/Header'
import Footer from '../Components/Footer'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)

      const response = await axios.get('http://localhost:3000/users')

      const existingUser = response.data.find(
        (user) =>
          user.email.toLowerCase() === email.trim().toLowerCase()
      )

      if (existingUser) {
        setError('An account with this email already exists.')
        return
      }

      await axios.post('http://localhost:3000/users', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: 'user'
      })

      alert('Registration successful! Please log in.')
      navigate('/login')
    } catch (error) {
      console.log('Registration error:', error)
      console.log('Error message:', error.message)
      console.log('Server response:', error.response?.data)

      setError(
        error.response?.data?.message ||
        error.message ||
        'Unable to register.'
      )
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
                  <h2 className="text-center fw-bold mb-2">
                    Create Account
                  </h2>

                  <p className="text-center text-secondary mb-4">
                    Join Civic Track and improve your community.
                  </p>

                  <Form onSubmit={handleRegister}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                      />
                    </Form.Group>

                    {error && (
                      <p className="text-danger" role="alert">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-100 mt-2"
                      disabled={loading}
                      style={{
                        backgroundColor: '#176B52',
                        border: 'none',
                        padding: '12px'
                      }}
                    >
                      {loading ? 'Creating Account...' : 'Register'}
                    </Button>
                  </Form>

                  <p className="text-center mt-4 mb-0">
                    Already have an account? <Link to="/login">Login</Link>
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

export default Register
