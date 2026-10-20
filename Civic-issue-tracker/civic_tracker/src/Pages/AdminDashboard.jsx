
import { useEffect, useState } from 'react'
import {
  Container,
  Card,
  Button,
  Badge,
  Row,
  Col,
  Form
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  FaClipboardList,
  FaHeart,
  FaCheckCircle
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import { fetchIssues } from '../Redux/slice/issueSlice'
import {
  deleteIssueAPI,
  updateIssueAPI
} from '../services/allAPI'
import { getLoggedUser } from '../utils/auth'

function AdminDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const admin = getLoggedUser()

  const { allIssues = [], error } = useSelector(
    (state) => state.issueReducer
  )

  const [responses, setResponses] = useState({})
  const [savingIssue, setSavingIssue] = useState(null)

  useEffect(() => {
    dispatch(fetchIssues())
  }, [dispatch])

  // FORMAT STATUS DATE
  const formatDate = (date) => {
    if (!date) return 'Date not available'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date not available'
    }

    return parsedDate.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // UPDATE ISSUE STATUS AND SAVE STATUS DATE
  const handleStatusChange = async (issue, selectedStatus) => {
    const dateFields = {
      Pending: 'pendingAt',
      'Under Review': 'underReviewAt',
      Approved: 'approvedAt',
      Assigned: 'assignedAt',
      'In Progress': 'inProgressAt',
      Resolved: 'resolvedAt',
      Rejected: 'rejectedAt'
    }

    const dateField = dateFields[selectedStatus]

    // Keep all existing issue details.
    const updatedIssue = {
      ...issue,
      status: selectedStatus
    }

    // Save the date and time only when the status changes.
    if (dateField && issue.status !== selectedStatus) {
      updatedIssue[dateField] = new Date().toISOString()
    }

    try {
      setSavingIssue(issue.id)

      // Save the complete updated issue to JSON Server.
      await updateIssueAPI(issue.id, updatedIssue)

      // Reload issues so the latest status and date are displayed.
      await dispatch(fetchIssues()).unwrap()

      toast.success('Issue status updated successfully!')
    } catch (error) {
      console.error('Status update failed:', error)
      toast.error('Unable to update issue status!')
    } finally {
      setSavingIssue(null)
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

      // Preserve all issue details while saving the response.
      await updateIssueAPI(issue.id, {
        ...issue,
        adminResponse
      })

      await dispatch(fetchIssues()).unwrap()

      toast.success('Official response saved successfully!')

      setResponses((previousResponses) => ({
        ...previousResponses,
        [issue.id]: adminResponse
      }))
    } catch (error) {
      console.error('Response save failed:', error)
      toast.error('Failed to save official response!')
    } finally {
      setSavingIssue(null)
    }
  }

  // DELETE ISSUE
  const handleDelete = async (issue) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) {
      return
    }

    try {
      setSavingIssue(issue.id)

      await deleteIssueAPI(issue.id)

      await dispatch(fetchIssues()).unwrap()

      toast.success('Issue deleted successfully!')
    } catch (error) {
      console.error('Issue deletion failed:', error)
      toast.error('Failed to delete the issue!')
    } finally {
      setSavingIssue(null)
    }
  }

  // COUNT PENDING ISSUES
  const pendingCount = allIssues.filter(
    (issue) => !issue.status || issue.status === 'Pending'
  ).length

  // COUNT IN-PROGRESS ISSUES
  const inProgressCount = allIssues.filter(
    (issue) => issue.status === 'In Progress'
  ).length

  // COUNT RESOLVED ISSUES
  const resolvedCount = allIssues.filter(
    (issue) => issue.status === 'Resolved'
  ).length

  // STATUS BADGE COLORS
  const getStatusVariant = (status) => {
    const variants = {
      Pending: 'warning',
      'Under Review': 'secondary',
      Approved: 'success',
      Assigned: 'info',
      'In Progress': 'primary',
      Resolved: 'success',
      Rejected: 'danger'
    }

    return variants[status] || 'warning'
  }

  return (
    <div
      style={{
        minHeight: '75vh',
        background: '#f5faf7',
        padding: '45px 15px'
      }}
    >
      <Container>
        {/* PAGE HEADING */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Admin Dashboard</h2>

            <p className="text-secondary mb-0">
              Welcome, {admin?.name || 'Admin'}. Review and manage community issues.
            </p>
          </div>

          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline-success"
          >
            View Community Dashboard
          </Button>
        </div>

        {/* ISSUE SUMMARY CARDS */}
        <Row className="g-3 mb-4">
          <Col xs={12} sm={6} lg={3}>
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

          <Col xs={12} sm={6} lg={3}>
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

          <Col xs={12} sm={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center gap-3">
                <FaClipboardList size={28} color="#0d6efd" />

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
                  <p className="text-secondary mb-1">Resolved Issues</p>
                  <h3 className="fw-bold mb-0">{resolvedCount}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {error && (
          <p className="text-danger">{error}</p>
        )}

        <h4 className="fw-bold mb-3">
          Issues by Community Priority
        </h4>

        {/* ISSUE LIST */}
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
                    {/* ISSUE HEADING */}
                    <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                      <div>
                        <Badge bg="success" className="mb-2">
                          Priority #{index + 1}
                        </Badge>

                        <h5 className="fw-bold mb-2">
                          {issue.title}
                        </h5>

                        <p className="text-secondary mb-2">
                          Category: {issue.category || 'Not specified'}
                        </p>
                      </div>

                      <Badge
                        bg={getStatusVariant(issue.status || 'Pending')}
                        text={
                          ['Pending', 'Under Review', 'Assigned'].includes(
                            issue.status || 'Pending'
                          )
                            ? 'dark'
                            : undefined
                        }
                        className="align-self-start"
                      >
                        {issue.status || 'Pending'}
                      </Badge>
                    </div>

                    {/* ISSUE DETAILS */}
                    <p>{issue.description}</p>

                    <p className="mb-2">
                      <strong>Location:</strong>{' '}
                      {issue.location || 'Not specified'}
                    </p>

                    <p className="text-secondary">
                      <FaHeart className="me-2" color="#176B52" />
                      {issue.supporters?.length || 0} supporters
                    </p>

                    {/* DISPLAY CURRENT STATUS DATE */}
                    {issue.status && issue.status !== 'Pending' && (
                      <div className="mb-3">
                        <p className="fw-semibold mb-1">
                          <FaClipboardList className="me-2" />
                          {issue.status} Since
                        </p>

                        <p className="text-secondary mb-0">
                          {formatDate(
                            issue[
                              {
                                'Under Review': 'underReviewAt',
                                Approved: 'approvedAt',
                                Assigned: 'assignedAt',
                                'In Progress': 'inProgressAt',
                                Resolved: 'resolvedAt',
                                Rejected: 'rejectedAt'
                              }[issue.status]
                            ]
                          )}
                        </p>
                      </div>
                    )}

                    {/* UPDATE ISSUE STATUS */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        Update Issue Status
                      </Form.Label>

                      <Form.Select
                        value={issue.status || 'Pending'}
                        onChange={(e) =>
                          handleStatusChange(issue, e.target.value)
                        }
                        disabled={savingIssue === issue.id}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </Form.Select>
                    </Form.Group>

                    {/* OFFICIAL ADMIN RESPONSE */}
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
                          setResponses((previousResponses) => ({
                            ...previousResponses,
                            [issue.id]: e.target.value
                          }))
                        }
                      />
                    </Form.Group>

                    {/* ACTION BUTTONS */}
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
                        disabled={savingIssue === issue.id}
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
