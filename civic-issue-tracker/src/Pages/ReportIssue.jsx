
import React, { useState } from 'react'
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  FaBullhorn,
  FaMapMarkerAlt,
  FaAlignLeft,
  FaTag,
  FaArrowLeft,
  FaPaperPlane,
  FaExclamationCircle
} from 'react-icons/fa'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { getLoggedUser } from '../utils/auth'

function ReportIssue() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const user = getLoggedUser()

    if (!user) {
      navigate('/login')
      return
    }

    if (
      !title.trim() ||
      !category.trim() ||
      !location.trim() ||
      !description.trim()
    ) {
      setError('Please fill in all the fields.')
      return
    }

    setLoading(true)

    try {
      await axios.post('http://localhost:3000/issues', {
        title: title.trim(),
        category: category.trim(),
        location: location.trim(),
        description: description.trim(),
        status: 'Pending',
        reportedBy: user.id,
        createdAt: new Date().toISOString()
      })

      navigate('/dashboard')
    } catch (error) {
      setError('Unable to submit your issue. Please check JSON Server and try again.')
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
          background: 'linear-gradient(135deg, #f0f9f5 0%, #ffffff 55%, #eaf5ef 100%)',
          padding: '45px 15px 60px'
        }}
      >
        <Container style={{ maxWidth: '1050px' }}>
          <Button
            variant="link"
            onClick={() => navigate('/dashboard')}
            className="text-decoration-none mb-3 p-0"
            style={{ color: '#176B52' }}
          >
            <FaArrowLeft className="me-2" />
            Back to Dashboard
          </Button>

          <Row className="align-items-stretch g-4">
            <Col lg={4}>
              <div
                className="h-100"
                style={{
                  background: '#176B52',
                  borderRadius: '20px',
                  padding: '35px 28px',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div
                  style={{
                    width: '65px',
                    height: '65px',
                    borderRadius: '18px',
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '25px'
                  }}
                >
                  <FaBullhorn size={30} />
                </div>

                <h2 className="fw-bold mb-3">
                  Make Your Voice Heard
                </h2>

                <p style={{ color: '#e1f2e9', lineHeight: '1.8' }}>
                  Help improve your neighbourhood by reporting civic problems
                  that need attention.
                </p>

                <hr style={{ borderColor: 'rgba(255,255,255,0.3)', margin: '25px 0' }} />

                <div className="d-flex gap-3 mb-4">
                  <FaExclamationCircle size={21} className="mt-1" />
                  <div>
                    <h6 className="fw-bold mb-1">Describe the problem</h6>
                    <small style={{ color: '#e1f2e9', lineHeight: '1.6' }}>
                      Explain what happened and why it needs attention.
                    </small>
                  </div>
                </div>

                <div className="d-flex gap-3 mb-4">
                  <FaMapMarkerAlt size={21} className="mt-1" />
                  <div>
                    <h6 className="fw-bold mb-1">Add the location</h6>
                    <small style={{ color: '#e1f2e9', lineHeight: '1.6' }}>
                      Help identify where the issue needs to be addressed.
                    </small>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <FaPaperPlane size={20} className="mt-1" />
                  <div>
                    <h6 className="fw-bold mb-1">Submit your report</h6>
                    <small style={{ color: '#e1f2e9', lineHeight: '1.6' }}>
                      Track your complaint from your dashboard.
                    </small>
                  </div>
                </div>

                <div className="mt-auto pt-5">
                  <small style={{ color: '#e1f2e9' }}>
                    Together, we can build a better community.
                  </small>
                </div>
              </div>
            </Col>

            <Col lg={8}>
              <Card
                className="h-100 border-0"
                style={{
                  borderRadius: '20px',
                  boxShadow: '0 12px 40px rgba(23,107,82,0.09)'
                }}
              >
                <Card.Body className="p-4 p-md-5">
                  <div className="mb-4">
                    <span
                      style={{
                        display: 'inline-block',
                        background: '#e2f4eb',
                        color: '#176B52',
                        padding: '7px 13px',
                        borderRadius: '30px',
                        fontSize: '13px',
                        fontWeight: '600',
                        marginBottom: '15px'
                      }}
                    >
                      CIVIC ISSUE REPORT
                    </span>

                    <h3 className="fw-bold mb-2">Report a New Issue</h3>

                    <p className="text-secondary mb-0">
                      Provide the details below so your complaint can be
                      reviewed.
                    </p>
                  </div>

                  {error && (
                    <Alert variant="danger" className="mb-4">
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        Complaint Title
                      </Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="e.g. Dangerous fallen tree blocking the road"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={120}
                        style={inputStyle}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <FaTag className="me-2" color="#176B52" />
                        Issue Category
                      </Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="e.g. Electricity line broken"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        maxLength={100}
                        style={inputStyle}
                      />

                      <Form.Text className="text-secondary">
                        Enter any category that best describes your issue.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <FaMapMarkerAlt className="me-2" color="#176B52" />
                        Location
                      </Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="e.g. Near the main bus stop, Palakkad"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        maxLength={200}
                        style={inputStyle}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <FaAlignLeft className="me-2" color="#176B52" />
                        Description
                      </Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Describe the problem, its condition, and how it affects people..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        maxLength={2000}
                        style={{
                          ...inputStyle,
                          resize: 'vertical'
                        }}
                      />

                      <div className="text-end mt-1">
                        <small className="text-secondary">
                          {description.length}/2000
                        </small>
                      </div>
                    </Form.Group>

                    <div className="d-flex flex-wrap gap-3 mt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="d-flex align-items-center justify-content-center gap-2"
                        style={{
                          backgroundColor: '#176B52',
                          border: 'none',
                          borderRadius: '9px',
                          padding: '12px 24px',
                          fontWeight: '600',
                          minWidth: '165px'
                        }}
                      >
                        <FaPaperPlane />
                        {loading ? 'Submitting...' : 'Submit Report'}
                      </Button>

                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() => navigate('/dashboard')}
                        style={{
                          borderRadius: '9px',
                          padding: '12px 24px'
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </>
  )
}

const inputStyle = {
  borderRadius: '9px',
  padding: '12px 14px',
  border: '1px solid #dce7e1',
  boxShadow: 'none'
}

export default ReportIssue
