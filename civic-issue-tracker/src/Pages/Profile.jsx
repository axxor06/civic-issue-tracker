
import React, { useEffect, useState } from 'react'
import { Container, Card, Form, Button, Badge, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle, FaEdit, FaArrowLeft } from 'react-icons/fa'
import axios from 'axios'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { getLoggedUser, saveLoggedUser } from '../utils/auth'

function Profile() {
  const navigate = useNavigate()
  const loggedUser = getLoggedUser()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!loggedUser) {
      navigate('/login', { replace: true })
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/users/${loggedUser.id}`
        )

        setName(response.data.name || '')
        setEmail(response.data.email || '')
        setRole(response.data.role || 'user')
      } catch (error) {
        setError('Unable to load profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.')
      return
    }

    try {
      setSaving(true)

      const usersResponse = await axios.get(
        'http://localhost:3000/users'
      )

      const existingUser = usersResponse.data.find(
        (user) =>
          user.id !== loggedUser.id &&
          user.email.toLowerCase() === email.trim().toLowerCase()
      )

      if (existingUser) {
        setError('This email is already registered.')
        return
      }

      const response = await axios.patch(
        `http://localhost:3000/users/${loggedUser.id}`,
        {
          name: name.trim(),
          email: email.trim().toLowerCase()
        }
      )

      saveLoggedUser({
        ...loggedUser,
        ...response.data
      })

      setName(response.data.name)
      setEmail(response.data.email)
      setEditing(false)
      setSuccess('Profile updated successfully!')
    } catch (error) {
      setError('Unable to update profile. Check your JSON Server connection.')
    } finally {
      setSaving(false)
    }
  }

  if (!loggedUser) {
    return null
  }

  return (
    <>
      <Header />

      <main
        style={{
          minHeight: '85vh',
          background: 'linear-gradient(135deg, #f0f9f5, #ffffff)',
          padding: '50px 15px'
        }}
      >
        <Container>
          <div className="mb-4">
            <Button
              variant="light"
              onClick={() => navigate('/dashboard')}
              style={{ color: '#176B52', border: '1px solid #e4eee8' }}
            >
              <FaArrowLeft className="me-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 col-md-9 col-lg-7">
              <Card
                style={{
                  border: '1px solid #e4eee8',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 35px rgba(23,107,82,0.09)'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#176B52',
                    padding: '30px',
                    textAlign: 'center',
                    color: 'white'
                  }}
                >
                  <FaUserCircle size={75} />
                  <h2 className="fw-bold mt-3 mb-1">My Profile</h2>
                  <p className="mb-0">Manage your account information</p>
                </div>

                <Card.Body className="p-4 p-md-5">
                  {loading ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" style={{ color: '#176B52' }} />
                      <p className="mt-3 text-secondary">Loading profile...</p>
                    </div>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <h5 className="fw-bold mb-1">
                            Account Details
                          </h5>
                          <p className="text-secondary mb-0">
                            Your personal information
                          </p>
                        </div>

                        {!editing && (
                          <Button
                            variant="outline-success"
                            onClick={() => {
                              setError('')
                              setSuccess('')
                              setEditing(true)
                            }}
                          >
                            <FaEdit className="me-2" />
                            Edit
                          </Button>
                        )}
                      </div>

                      {error && (
                        <div className="alert alert-danger">{error}</div>
                      )}

                      {success && (
                        <div className="alert alert-success">{success}</div>
                      )}

                      {editing ? (
                        <Form onSubmit={handleUpdate}>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Enter your name"
                              required
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email"
                              required
                            />
                          </Form.Group>

                          <div className="d-flex gap-2 mt-4">
                            <Button
                              type="submit"
                              disabled={saving}
                              style={{
                                backgroundColor: '#176B52',
                                border: 'none'
                              }}
                            >
                              {saving ? 'Saving...' : 'Save Changes'}
                            </Button>

                            <Button
                              type="button"
                              variant="light"
                              onClick={() => {
                                setName(loggedUser.name || '')
                                setEmail(loggedUser.email || '')
                                setEditing(false)
                                setError('')
                                setSuccess('')
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </Form>
                      ) : (
                        <>
                          <div className="mb-4">
                            <p className="text-secondary mb-1">Full Name</p>
                            <h5 className="fw-semibold">{name}</h5>
                          </div>

                          <div className="mb-4">
                            <p className="text-secondary mb-1">Email Address</p>
                            <h6>{email}</h6>
                          </div>

                          <div className="mb-2">
                            <p className="text-secondary mb-2">Account Role</p>
                            <Badge
                              bg="success"
                              className="px-3 py-2"
                              style={{ textTransform: 'capitalize' }}
                            >
                              {role}
                            </Badge>
                          </div>
                        </>
                      )}
                    </>
                  )}
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

export default Profile
