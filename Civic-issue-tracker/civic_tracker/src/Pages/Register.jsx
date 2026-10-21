import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAllUsersAPI, registerUserAPI } from '../services/allAPI'
import { Container, Form, Button, Card } from 'react-bootstrap'
import { FaUser } from "react-icons/fa";


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
      const response = await getAllUsersAPI()

      const exists = response.data.some(
        (user) => user.email.toLowerCase() === email.trim().toLowerCase()
      )

      if (exists) {
        setError('An account with this email already exists.')
        return
      }

      await registerUserAPI({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: 'user',
      })

      toast.success('Account created. Please log in.')
      navigate('/login')
    } catch {
      setError('Unable to register. Make sure json-server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
   <>

      <main
        style={{
          backgroundImage: `linear-gradient(
      rgba(0, 0, 0, 0.35),
      rgba(0, 0, 0, 0.35)
    ), url('https://static.vecteezy.com/system/resources/thumbnails/071/597/922/small_2x/a-silhouette-of-a-large-crowd-of-people-protesting-with-raised-signs-and-fists-against-a-dramatic-orange-sky-photo.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          padding: '100px '
        }}
      >

        <Container>
          <div className="row justify-content-center">
            <div className="  col-12 col-sm-10 col-md-7 col-lg-5">
              <Card
                style={{
                  border: '1px solid #e4eee8',
                  borderRadius: '20px',
                  padding: '5px',
                  boxShadow: '0 12px 35px rgba(23,107,82,0.09)'
                }}
              >
                <Card.Body>
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
                    <FaUser size={32} />
                  </div>
                  <h2 className="text-center fw-bold mb-2">
                    Create Account
                  </h2>

                  <p className="text-center text-secondary mb-4">
                    Join Civic-Tracker and Solve Your Problems.
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


    </>

  )
}

export default Register