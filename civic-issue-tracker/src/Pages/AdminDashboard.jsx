import React, { useEffect, useState } from 'react'
import { Container, Card, Button, Badge, Row, Col, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaClipboardList, FaHeart, FaCheckCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { getLoggedUser } from '../utils/auth'
import api from '../utils/api'

function AdminDashboard() {
  const navigate = useNavigate()

  const [admin, setAdmin] = useState(null)
  const [issues, setIssues] = useState([])
  const [responses, setResponses] = useState({})
  const [error, setError] = useState('')
  const [savingIssue, setSavingIssue] = useState(null)

  useEffect(() => {
    const loggedUser = getLoggedUser()

    if (!loggedUser) {
      navigate('/login', { replace: true })
      return
    }

    if (loggedUser.role !== 'admin') {
      navigate('/dashboard', { replace: true })
      return
    }

    setAdmin(loggedUser)

    const fetchIssues = async () => {
      try {
        const response = await api.get('/issues')

        const sortedIssues = response.data.sort((a, b) => {
          if (a.status === 'Resolved' && b.status !== 'Resolved') return 1
          if (a.status !== 'Resolved' && b.status === 'Resolved') return -1

          return (b.supporters?.length || 0) - (a.supporters?.length || 0)
        })

        setIssues(sortedIssues)

        const savedResponses = {}

        response.data.forEach((issue) => {
          savedResponses[issue.id] = issue.adminResponse || ''
        })

        setResponses(savedResponses)
      } catch {
        setError('Unable to load issues. Check JSON Server.')
        toast.error('Failed to load issues!')
      }
    }

    fetchIssues()
  }, [navigate])

  const handleStatusChange = async (issue, status) => {
    try {
      await api.patch(`/issues/${issue.id}`, { status })

      setIssues((previousIssues) =>
        previousIssues.map((item) =>
          String(item.id) === String(issue.id)
            ? { ...item, status }
            : item
        )
      )

      toast.success('Issue status updated successfully!')
    } catch {
      toast.error('Failed to update issue status!')
    }
  }

  const handleResponseSave = async (issue) => {
    const adminResponse = (responses[issue.id] || '').trim()

    if (!adminResponse) {
      toast.error('Please write an official response first!')
      return
    }

    try {
      setSavingIssue(issue.id)

      await api.patch(`/issues/${issue.id}`, { adminResponse })

      setIssues((previousIssues) =>
        previousIssues.map((item) =>
          String(item.id) === String(issue.id)
            ? { ...item, adminResponse }
            : item
        )
      )

      toast.success('Official response saved successfully!')
    } catch {
      toast.error('Failed to save official response!')
    } finally {
      setSavingIssue(null)
    }
  }

  const pendingCount = issues.filter(
    (issue) => !issue.status || issue.status === 'Pending'
  ).length

  const resolvedCount = issues.filter(
    (issue) => issue.status === 'Resolved'
  ).length

  return (
    <>
      <Header insideLogin />

      <main
        style={{
          minHeight: '75vh',
          background: '#f5faf7',
          padding: '45px 15px'
        }}
      >
        <Container>
          {admin && (
            <>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                  <h2 className="fw-bold mb-1">Admin Dashboard</h2>
                  <p className="text-secondary mb-0">
                    Welcome, {admin.name}. Review and manage community issues.
                  </p>
                </div>

                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline-success"
                >
                  View Community Dashboard
                </Button>
              </div>

              <Row className="g-3 mb-4">
                <Col xs={12} sm={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="d-flex align-items-center gap-3">
                      <FaClipboardList size={28} color="#176B52" />
                      <div>
                        <p className="text-secondary mb-1">Total Issues</p>
                        <h3 className="fw-bold mb-0">{issues.length}</h3>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} sm={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="d-flex align-items-center gap-3">
                      <FaHeart size={28} color="#d99a00" />
                      <div>
                        <p className="text-secondary mb-1">Pending Issues</p>
                        <h3 className="fw-bold mb-0">{pendingCount}</h3>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} sm={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="d-flex align-items-center gap-3">
                      <FaCheckCircle size={28} color="#198754" />
                      <div>
                        <p className="text-secondary mb-1">Resolved Issues</p>
                        <h3 className="fw-bold mb-0">{resolvedCount}</h3>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {error && <p className="text-danger">{error}</p>}

              <h4 className="fw-bold mb-3">Issues by Community Priority</h4>

              {issues.length === 0 ? (
                <Card className="border-0 shadow-sm text-center p-5">
                  <Card.Body>
                    <h5>No community issues yet</h5>
                    <p className="text-secondary mb-0">
                      Reported issues will appear here.
                    </p>
                  </Card.Body>
                </Card>
              ) : (
                <Row className="g-3">
                  {issues.map((issue, index) => (
                    <Col xs={12} key={issue.id}>
                      <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                          <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                            <div>
                              <Badge bg="success" className="mb-2">
                                Priority #{index + 1}
                              </Badge>

                              <h5 className="fw-bold mb-2">{issue.title}</h5>

                              <p className="text-secondary mb-2">
                                Category: {issue.category || 'Not specified'}
                              </p>
                            </div>

                            <Badge
                              bg={
                                issue.status === 'Resolved'
                                  ? 'success'
                                  : issue.status === 'In Progress'
                                    ? 'primary'
                                    : 'warning'
                              }
                              className="align-self-start"
                            >
                              {issue.status || 'Pending'}
                            </Badge>
                          </div>

                          <p>{issue.description}</p>

                          <p className="mb-2">
                            <strong>Location:</strong>{' '}
                            {issue.location || 'Not specified'}
                          </p>

                          <p className="text-secondary">
                            <FaHeart className="me-2" color="#176B52" />
                            {issue.supporters?.length || 0} supporters
                          </p>

                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              Update Issue Status
                            </Form.Label>

                            <Form.Select
                              value={issue.status || 'Pending'}
                              onChange={(e) =>
                                handleStatusChange(issue, e.target.value)
                              }
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              Official Admin Response
                            </Form.Label>

                            <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Write an update for the community..."
                              value={responses[issue.id] || ''}
                              onChange={(e) =>
                                setResponses({
                                  ...responses,
                                  [issue.id]: e.target.value
                                })
                              }
                            />
                          </Form.Group>

                          <Button
                            onClick={() => handleResponseSave(issue)}
                            disabled={savingIssue === issue.id}
                            style={{
                              backgroundColor: '#176B52',
                              border: 'none'
                            }}
                          >
                            {savingIssue === issue.id
                              ? 'Saving...'
                              : 'Save Official Response'}
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}
        </Container>
      </main>

      <Footer />
    </>
  )
}

export default AdminDashboard
