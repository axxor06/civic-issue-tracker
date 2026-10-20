import { useEffect, useState } from 'react'
import { Container, Card, Button, Badge, Row, Col, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaClipboardList, FaHeart, FaCheckCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { fetchIssues } from '../Redux/slice/issueSlice'
import { deleteIssueAPI, updateIssueAPI } from '../services/allAPI'
import { getLoggedUser } from '../utils/auth'

function AdminDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const admin = getLoggedUser()
  const { allIssues, error } = useSelector((state) => state.issueReducer)

  const [responses, setResponses] = useState({})
  const [savingIssue, setSavingIssue] = useState(null)

  useEffect(() => {
    dispatch(fetchIssues())
  }, [dispatch])

  // UPDATE ISSUE STATUS AND SAVE RESOLUTION DATE
const handleStatusChange = async (issue, status) => {
  try {
    const updateData = {
      status,
      ...(status === 'Resolved' && !issue.resolvedAt
        ? { resolvedAt: new Date().toISOString() }
        : {})
    }

    await updateIssueAPI(issue.id, updateData)
    dispatch(fetchIssues())
    toast.success('Issue status updated successfully!')
  } catch (error) {
    console.error(error)
    toast.error('Failed to update issue status!')
  }
}

  // SAVE OFFICIAL ADMIN RESPONSE
  const handleResponseSave = async (issue) => {
    const adminResponse = (
      responses[issue.id] !== undefined
        ? responses[issue.id]
        : issue.adminResponse || ''
    ).trim()

    if (!adminResponse) {
      toast.error('Please write an official response first!')
      return
    }

    try {
      setSavingIssue(issue.id)

      await updateIssueAPI(issue.id, { adminResponse })

      dispatch(fetchIssues())

      toast.success('Official response saved successfully!')
    } catch {
      toast.error('Failed to save official response!')
    } finally {
      setSavingIssue(null)
    }
  }

  // DELETE ISSUE
  const handleDelete = async (issue) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        await deleteIssueAPI(issue.id)

        dispatch(fetchIssues())

        toast.success('Issue deleted successfully!')
      } catch {
        toast.error('Failed to delete the issue!')
      }
    }
  }

  const pendingCount = allIssues.filter(
    (issue) => !issue.status || issue.status === 'Pending'
  ).length

  const resolvedCount = allIssues.filter(
    (issue) => issue.status === 'Resolved'
  ).length

  return (
    <div
      style={{
        minHeight: '75vh',
        background: '#f5faf7',
        padding: '45px 15px'
      }}
    >
      <Container>
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
                  <h3 className="fw-bold mb-0">{allIssues.length}</h3>
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

        {allIssues.length === 0 ? (
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
            {allIssues.map((issue, index) => (
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

                    {issue.status === 'Resolved' && (
                      <div className="mb-3">
                        <p className="text-success fw-semibold mb-1">
                          <FaCheckCircle className="me-2" />
                          Resolved on
                        </p>

                        <p className="text-secondary mb-0">
                          {issue.resolvedAt
                            ? new Date(issue.resolvedAt).toLocaleString()
                            : 'Resolution date not available'}
                        </p>
                      </div>
                    )}

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
                        value={
                          responses[issue.id] !== undefined
                            ? responses[issue.id]
                            : issue.adminResponse || ''
                        }
                        onChange={(e) =>
                          setResponses({
                            ...responses,
                            [issue.id]: e.target.value
                          })
                        }
                      />
                    </Form.Group>

                    <div className="d-flex flex-wrap gap-2">
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

                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(issue)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  )
}

export default AdminDashboard