import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAllUsersAPI } from '../services/allAPI'
import { saveLoggedUser } from '../utils/auth'
import { Container, Form, Button, Card } from 'react-bootstrap'


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
      const response = await getAllUsersAPI()

      const user = response.data.find(
        (item) =>
          item.email.toLowerCase() === email.trim().toLowerCase() &&
          item.password === password
      )

      if (!user) {
        toast.error('Invalid email or password')
        return
      }

      saveLoggedUser(user)
      toast.success(`Welcome back, ${user.name}`)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch {
      toast.error('Unable to log in. Make sure json-server is running.')
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
    backgroundRepeat: 'no-repeat',
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    padding: '100px '
  }}
>
        <Container>
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-7 col-lg-5">
              <Card
                style={{
                  border: '1px solid #e4eee8',
                  borderRadius: '20px',
                  padding: '10px',
                  boxShadow: '0 12px 35px rgba(23,107,82,0.09)',
                  marginBottom:'30px'
                }}
              >
                <Card.Body>
                  <div className="text-center mb-1 ">
                  <img width={'90px'} height={'90px'} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfBxkIlIxwNyveMs8LN3oY4eEzKX6rMeSFpCZSuM3kk9MfHZZbegMZ68g&s=10" alt="logo" />

                    <h3 className="fw-bold">Welcome to Civic-Tracker</h3>
                    <p className="text-secondary">Sign in to continue</p>
                  </div>

                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>

                      <div className="d-flex">
                     

                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          style={{
                            padding: '12px',
                            borderRadius: ' 8px 8px '
                          }}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>

                      <div className="d-flex">
                     

                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          style={{ padding: '12px', borderRadius: 6 }}
                        />

                    
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

   
    </>
  )
}

export default Login