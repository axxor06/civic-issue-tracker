import React, { useEffect, useState } from 'react'
import {
  Container,
  Card,
  Button,
  Badge,
  Row,
  Col
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import {
  FaHeart,
  FaMapMarkerAlt,
  FaClipboardList,
  FaCheckCircle
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { getLoggedUser } from '../utils/auth'
import api from '../utils/api'

function Dashboard() {
  const navigate = useNavigate()

  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await api.get('/issues')

        const sortedIssues = response.data.sort((a, b) => {
          if (a.status === 'Resolved' && b.status !== 'Resolved') return 1
          if (a.status !== 'Resolved' && b.status === 'Resolved') return -1

          return (b.supporters?.length || 0) - (a.supporters?.length || 0)
        })

        setIssues(sortedIssues)
      } catch {
        toast.error('Unable to load community issues!')
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [])

  const handleSupport = async (issue) => {
    const loggedUser = getLoggedUser()

    if (!loggedUser || loggedUser.id == null) {
      toast.error('Please log in to support an issue!')
      navigate('/login')
      return
    }

    if (issue.status === 'Resolved') {
      toast.info('This issue has already been resolved.')
      return
    }

    const currentSupporters = issue.supporters || []
    const userId = String(loggedUser.id)

    const alreadySupported = currentSupporters.some(
      (id) => String(id) === userId
    )

    const updatedSupporters = alreadySupported
      ? currentSupporters.filter((id) => String(id) !== userId)
      : [...currentSupporters, loggedUser.id]

    try {
      const response = await api.patch(`/issues/${issue.id}`, {
        supporters: updatedSupporters
      })

      setIssues((previousIssues) => {
        const updatedIssues = previousIssues.map((item) =>
          String(item.id) === String(issue.id)
            ? response.data
            : item
        )

        return [...updatedIssues].sort((a, b) => {
          if (a.status === 'Resolved' && b.status !== 'Resolved') return 1
          if (a.status !== 'Resolved' && b.status === 'Resolved') return -1

          return (b.supporters?.length || 0) - (a.supporters?.length || 0)
        })
      })

      toast.success(
        alreadySupported
          ? 'Support withdrawn successfully!'
          : 'Issue supported successfully!'
      )
    } catch {
      toast.error('Unable to update support. Please try again!')
    }
  }

  const pendingCount = issues.filter(
    (issue) => !issue.status || issue.status === 'Pending'
  ).length

  const inProgressCount = issues.filter(
    (issue) => issue.status === 'In Progress'
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
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <div>
              <h2 className="fw-bold mb-1">Community Dashboard</h2>
              <p className="text-secondary mb-0">
                Explore community issues, support important causes, and track progress.
              </p>
            </div>

            <Button
              variant="success"
              onClick={() => navigate('/report-issue')}
            >
              + Report New Issue
            </Button>
          </div>

          <Row className="g-3 mb-4">
            <Col xs={12} sm={6} lg={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="d-flex align-items-center gap-3">
                  <FaClipboardList size={28} color="#176B52" />
                  <div>
                    <p className="text-secondary mb-1">Community Issues</p>
                    <h3 className="fw-bold mb-0">{issues.length}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="d-flex align-items-center gap-3">
                  <FaHeart size={28} color="#d99a00" />
                  <div>
                    <p className="text-secondary mb-1">Pending</p>
                    <h3 className="fw-bold mb-0">{pendingCount}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="d-flex align-items-center gap-3">
                  <FaMapMarkerAlt size={28} color="#0d6efd" />
                  <div>
                    <p className="text-secondary mb-1">In Progress</p>
                    <h3 className="fw-bold mb-0">{inProgressCount}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="d-flex align-items-center gap-3">
                  <FaCheckCircle size={28} color="#198754" />
                  <div>
                    <p className="text-secondary mb-1">Resolved</p>
                    <h3 className="fw-bold mb-0">{resolvedCount}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <h4 className="fw-bold mb-3">Issues by Community Priority</h4>

          {loading ? (
            <p className="text-secondary">Loading community issues...</p>
          ) : issues.length === 0 ? (
            <Card className="border-0 shadow-sm text-center p-5">
              <Card.Body>
                <h5>No community issues yet</h5>
                <p className="text-secondary mb-3">
                  Be the first to report a community issue.
                </p>

                <Button
                  variant="success"
                  onClick={() => navigate('/report-issue')}
                >
                  Report New Issue
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-3">
              {issues.map((issue, index) => {
                const loggedUser = getLoggedUser()

                const alreadySupported =
                  loggedUser?.id != null &&
                  (issue.supporters || []).some(
                    (id) => String(id) === String(loggedUser.id)
                  )

                return (
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

                        <p className="text-secondary mb-3">
                          <FaHeart className="me-2" color="#176B52" />
                          {issue.supporters?.length || 0} supporters
                        </p>

                        {issue.adminResponse && (
                          <div className="mt-3 mb-3 p-3 bg-light rounded border">
                            <h6
                              className="fw-bold mb-2"
                              style={{ color: '#176B52' }}
                            >
                              Official Admin Response
                            </h6>

                            <p className="mb-0">{issue.adminResponse}</p>
                          </div>
                        )}

                        <Button
                          onClick={() => handleSupport(issue)}
                          disabled={issue.status === 'Resolved'}
                          variant={
                            alreadySupported
                              ? 'outline-success'
                              : 'success'
                          }
                        >
                          <FaHeart className="me-2" />

                          {issue.status === 'Resolved'
                            ? 'Issue Resolved'
                            : alreadySupported
                              ? 'Withdraw Support'
                              : 'Support Issue'}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          )}
        </Container>
      </main>

      <Footer />
    </>
  )
}

export default Dashboard
