import { useEffect, useState } from 'react'
import { Container, Card, Button, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaMapMarkerAlt, FaTachometerAlt, FaFileAlt, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { FaRoad, FaLightbulb, FaTrashCan, FaBolt, FaDroplet, FaVolumeHigh, FaEllipsis } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { fetchIssues } from '../Redux/slice/issueSlice'
import { deleteIssueAPI, updateIssueAPI } from '../services/allAPI'
import { getLoggedUser } from '../utils/auth'

const categories = [
  { name: 'Road', icon: FaRoad, color: '#d97706' },
  { name: 'Streetlight', icon: FaLightbulb, color: '#ca8a04' },
  { name: 'Waste', icon: FaTrashCan, color: '#0d9488' },
  { name: 'Electricity', icon: FaBolt, color: '#eab308' },
  { name: 'Water', icon: FaDroplet, color: '#0284c7' },
  { name: 'Noise', icon: FaVolumeHigh, color: '#9333ea' },
  { name: 'Other', icon: FaEllipsis, color: '#6366f1' }
]

const categoryNames = {
  Road: ['road', 'roads'],
  Streetlight: ['streetlight', 'streetlights', 'street light', 'street lights'],
  Waste: ['waste', 'waste management'],
  Electricity: ['electricity'],
  Water: ['water', 'water supply', 'water supply & drainage', 'water supply and drainage', 'drainage'],
  Noise: ['noise', 'noise pollution'],
  Other: ['other']
}

const sidebarButtonStyle = {
  border: 'none',
  borderRadius: '8px',
  padding: '13px 15px',
  background: 'transparent',
  color: '#ffffff',
  fontSize: '16px',
  width: '100%',
  textAlign: 'left',
  cursor: 'pointer'
}

function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loggedUser = getLoggedUser()

  const { allIssues, loading, error } = useSelector(
    (state) => state.issueReducer
  )

  const [selectedCategory, setSelectedCategory] = useState('All Issues')

  useEffect(() => {
    dispatch(fetchIssues())
  }, [dispatch])

  // Log out the current user
  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    toast.success('Logged out successfully!')
    navigate('/login', { replace: true })
  }

  // Show all issues or only the selected category
  const filteredIssues = allIssues.filter((issue) => {
    if (selectedCategory === 'All Issues') return true

    const category = (issue.category || '').toLowerCase().trim()
    return categoryNames[selectedCategory]?.includes(category)
  })

  // Add or remove the logged-in user from an issue's supporters
  const handleSupport = async (issue) => {
    if (issue.status === 'Resolved') {
      toast.info('This issue has already been resolved.')
      return
    }

    const supporters = issue.supporters || []
    const userId = String(loggedUser.id)
    const alreadySupported = supporters.some((id) => String(id) === userId)

    const updatedSupporters = alreadySupported
      ? supporters.filter((id) => String(id) !== userId)
      : [...supporters, loggedUser.id]

    try {
      await updateIssueAPI(issue.id, { supporters: updatedSupporters })
      dispatch(fetchIssues())
      toast.success(
        alreadySupported
          ? 'Support withdrawn successfully!'
          : 'Issue supported successfully!'
      )
    } catch {
      toast.error('Unable to update support. Please try again!')
    }
  }

  // Delete an issue
  const handleDelete = async (issue) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return

    try {
      await deleteIssueAPI(issue.id)
      dispatch(fetchIssues())
      toast.success('Issue deleted successfully!')
    } catch {
      toast.error('Unable to delete the issue!')
    }
  }

  // Check if the current user can delete this issue
  const canDeleteIssue = (issue) =>
    loggedUser?.role === 'admin' ||
    String(issue.reportedBy) === String(loggedUser?.id)

  // Check if the current user already supports this issue
  const hasSupported = (issue) =>
    (issue.supporters || []).some(
      (id) => String(id) === String(loggedUser?.id)
    )

  return (
    <div
      className="container-fluid p-0"
      style={{ height: '100vh', overflow: 'hidden', background: '#f5faf7' }}
    >
      <div className="row g-0 h-100">
        {/* Sidebar */}
        <aside
          className="col-12 col-lg-2 p-3 p-lg-4"
          style={{
            background: '#202725',
            color: '#ffffff',
            height: '100vh',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          <div
            className="d-flex align-items-center gap-3 pb-4 mb-3"
            style={{ borderBottom: '1px solid #46534c' }}
          >
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#d5f5e3',
                color: '#123b31',
                fontSize: '23px',
                fontWeight: 'bold',
                flexShrink: 0
              }}
            >
              C
            </div>
            <div>
              <h4 className="mb-0 fw-bold">CivicPulse</h4>
              <small style={{ color: '#b7c9bf' }}>Community Portal</small>
            </div>
          </div>

          <nav className="d-flex flex-row flex-wrap flex-lg-column gap-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="d-flex align-items-center gap-3"
              style={{ ...sidebarButtonStyle, background: '#176b52', flex: '1 1 auto' }}
            >
              <FaTachometerAlt size={19} />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => navigate('/my-reports')}
              className="d-flex align-items-center gap-3"
              style={{ ...sidebarButtonStyle, flex: '1 1 auto' }}
            >
              <FaFileAlt size={19} />
              My Reports
            </button>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="d-flex align-items-center gap-3"
              style={{ ...sidebarButtonStyle, flex: '1 1 auto' }}
            >
              <FaUser size={19} />
              Profile
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="d-flex align-items-center gap-3"
              style={{ ...sidebarButtonStyle, color: '#ffb4a9', flex: '1 1 auto' }}
            >
              <FaSignOutAlt size={19} />
              Logout
            </button>
          </nav>

          <div className="mt-5 pt-4" style={{ borderTop: '1px solid #46534c' }}>
            <small style={{ color: '#b7c9bf' }}>Making communities better</small>
          </div>
        </aside>

        {/* Main dashboard */}
        <main
          className="col-12 col-lg-10 p-3 p-md-4 p-xl-5"
          style={{
            height: '100vh',
            minWidth: 0,
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          <Container fluid>
            {/* Community banner */}
            <div
              className="p-4 p-md-5 mb-4 rounded-4"
              style={{
                background: 'linear-gradient(135deg, #123b31, #1b5e49)',
                color: 'white'
              }}
            >
              <span
                className="badge rounded-pill mb-3"
                style={{
                  backgroundColor: '#285b4b',
                  color: '#d5f5e3',
                  padding: '8px 14px'
                }}
              >
                CIVICPULSE COMMUNITY
              </span>

              <h2 className="fw-bold mb-3">Your Community. Your Voice.</h2>
              <p className="mb-4" style={{ color: '#d3e7dc', lineHeight: '1.8' }}>
                See a problem? Be the reason it gets noticed. Report local issues,
                support community complaints, and follow their progress toward resolution.
              </p>

              <div
                className="d-flex align-items-center gap-3 p-3 rounded-3 mb-4"
                style={{ backgroundColor: 'rgba(255,255,255,0.10)', maxWidth: '500px' }}
              >
                <i className="fa-solid fa-location-dot fs-3" style={{ color: '#72dfa5' }} />
                <div>
                  <h6 className="fw-bold mb-1">Make an impact locally</h6>
                  <small style={{ color: '#d3e7dc' }}>
                    Roads · Waste · Water · Electricity · Noise · Streetlights
                  </small>
                </div>
              </div>

              <Button
                variant="success"
                onClick={() => navigate('/report-issue')}
                className="fw-semibold px-4 py-2"
              >
                <i className="fa-solid fa-plus me-2" />
                Report New Issue
                <i className="fa-solid fa-arrow-right ms-2" />
              </Button>
            </div>

            {/* Issues heading */}
            <h4
              className="fw-bold mb-3 text-center pt-3"
              style={{ color: '#18352b', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}
            >
              Reported Community Issues
            </h4>

            {/* Category filters */}
            <div className="mb-4 pt-3">
              <div className="mb-4 text-center">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All Issues')}
                  className="text-start"
                  style={{
                    width: '100%',
                    maxWidth: '750px',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '20px',
                    background: '#123b31',
                    color: '#ffffff',
                    boxShadow: selectedCategory === 'All Issues'
                      ? '0 8px 22px rgba(18, 59, 49, 0.25)'
                      : '0 4px 12px rgba(18, 59, 49, 0.12)',
                    outline: selectedCategory === 'All Issues' ? '2px solid #a7e8c3' : 'none',
                    outlineOffset: '3px',
                    cursor: 'pointer'
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        color: '#176b52',
                        fontSize: '23px',
                        flexShrink: 0
                      }}
                    >
                      <i className="fa-solid fa-layer-group" />
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="fw-bold mb-1">All Issues</h5>
                      <small style={{ color: '#c6e5d5' }}>Community issue overview</small>
                    </div>
                    <i className="fa-solid fa-circle-arrow-right" style={{ fontSize: '28px', color: '#a7e8c3' }} />
                  </div>

                  <div
                    className="d-flex justify-content-between align-items-center mt-3 pt-3"
                    style={{ borderTop: '1px solid #477064' }}
                  >
                    <small style={{ color: '#d5f5e3' }}>View all reported complaints</small>
                    <span
                      className="badge rounded-pill px-3 py-2"
                      style={{
                        background: '#d5f5e3',
                        color: '#123b31',
                        fontSize: '10px',
                        letterSpacing: '0.5px'
                      }}
                    >
                      VIEW ALL
                    </span>
                  </div>
                </button>
              </div>

              <h6 className="fw-bold mb-3" style={{ color: '#18352b' }}>
                All Categories
              </h6>

              <div className="d-flex flex-wrap gap-3">
                {categories.map((category) => {
                  const Icon = category.icon
                  const isActive = selectedCategory === category.name

                  return (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => setSelectedCategory(category.name)}
                      className="d-flex align-items-center gap-3 text-start"
                      style={{
                        border: isActive ? '2px solid #198754' : '1px solid #e5e7eb',
                        borderRadius: '14px',
                        padding: '13px 17px',
                        background: isActive ? '#eaf6ee' : '#ffffff',
                        color: '#24352b',
                        minWidth: '145px',
                        boxShadow: isActive
                          ? '0 4px 12px rgba(25, 135, 84, 0.12)'
                          : '0 2px 6px rgba(0, 0, 0, 0.04)',
                        cursor: 'pointer'
                      }}
                    >
                      <span
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: '42px',
                          height: '42px',
                          flexShrink: 0,
                          borderRadius: '12px',
                          background: isActive ? '#198754' : `${category.color}18`,
                          color: isActive ? '#ffffff' : category.color,
                          fontSize: '17px'
                        }}
                      >
                        <Icon size={19} />
                      </span>
                      <span>
                        <span className="d-block" style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                          {category.name}
                        </span>
                        <span className="d-block mt-1" style={{ fontSize: '11px', color: isActive ? '#198754' : '#9ca3af' }}>
                          {isActive ? 'Selected' : 'View category'}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected category and count */}
            <h5 className="fw-semibold mb-3" style={{ color: '#475467' }}>
              {selectedCategory === 'All Issues' ? 'All Reported Issues' : `${selectedCategory} Issues`}
              <span className="text-secondary ms-2">({filteredIssues.length})</span>
            </h5>

            {/* Loading, error and empty messages */}
            {loading && allIssues.length === 0 ? (
              <p className="text-secondary">Loading community issues...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : allIssues.length === 0 ? (
              <Card className="border-0 shadow-sm text-center p-5">
                <Card.Body>
                  <h5>No community issues yet</h5>
                  <p className="text-secondary mb-3">Be the first to report a community issue.</p>
                  <Button variant="success" onClick={() => navigate('/report-issue')}>
                    Report New Issue
                  </Button>
                </Card.Body>
              </Card>
            ) : filteredIssues.length === 0 ? (
              <Card className="border-0 shadow-sm text-center p-5">
                <Card.Body>
                  <i className="fa-solid fa-folder-open mb-3" style={{ fontSize: '35px', color: '#176b52' }} />
                  <h5 className="fw-bold">No {selectedCategory} issues found</h5>
                  <p className="text-secondary mb-3">There are no reported issues in this category yet.</p>
                  <Button variant="outline-success" onClick={() => setSelectedCategory('All Issues')}>
                    View All Issues
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <div className="d-flex flex-column gap-3">
                {filteredIssues.map((issue, index) => {
                  const alreadySupported = hasSupported(issue)

                  return (
                    <Card
                      key={issue.id}
                      className="border-0 shadow-sm overflow-hidden mb-3"
                      style={{
                        borderRadius: '16px',
                        borderLeft: '6px solid #176b52',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <Card.Body className="p-4">
                        {/* Priority and status */}
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                          <span
                            className="badge rounded-pill"
                            style={{
                              backgroundColor: '#176b52',
                              color: '#ffffff',
                              padding: '8px 13px',
                              fontSize: '12px'
                            }}
                          >
                            <i className="fa-solid fa-flag me-2" />
                            Priority {index + 1}
                          </span>

                          <Badge
                            bg={issue.status === 'Resolved' ? 'success' : issue.status === 'In Progress' ? 'primary' : 'warning'}
                            text={issue.status === 'Pending' || !issue.status ? 'dark' : undefined}
                            pill
                            className="px-3 py-2"
                          >
                            {issue.status || 'Pending'}
                          </Badge>
                        </div>

                        <h5 className="fw-bold mb-3" style={{ color: '#18352b', lineHeight: '1.5' }}>
                          {issue.title}
                        </h5>

                        {/* Category and location */}
                        <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                          <span
                            className="badge rounded-pill"
                            style={{ backgroundColor: '#d9efe2', color: '#176b52', padding: '7px 12px' }}
                          >
                            {issue.category || 'General Issue'}
                          </span>
                          <span className="text-secondary small">
                            <FaMapMarkerAlt className="me-2" color="#198754" />
                            {issue.location || 'Location not specified'}
                          </span>
                        </div>

                        <p className="mb-4" style={{ color: '#475467', lineHeight: '1.8' }}>
                          {issue.description}
                        </p>

                        {/* Supporter information */}
                        <div
                          className="d-flex align-items-center flex-wrap p-3 mb-4"
                          style={{ backgroundColor: '#f0f8f4', borderRadius: '12px' }}
                        >
                          <div className="d-flex align-items-center gap-3 flex-grow-1 p-2">
                            <div
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                backgroundColor: '#d4f1e3',
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                flexShrink: 0
                              }}
                            >
                              <FaHeart color="#176b52" size={21} />
                            </div>
                            <div>
                              <h6 className="fw-bold mb-1" style={{ color: '#18352b' }}>
                                {issue.supporters?.length || 0} supporters
                              </h6>
                              <small className="text-secondary">Community voices matter</small>
                            </div>
                          </div>

                          <div
                            className="d-flex align-items-center gap-3 flex-grow-1 p-2"
                            style={{ borderLeft: '1px solid #cde4d8' }}
                          >
                            <div
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                backgroundColor: '#d4f1e3',
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                flexShrink: 0
                              }}
                            >
                              <i className="fa-solid fa-users" style={{ color: '#176b52', fontSize: '20px' }} />
                            </div>
                            <div>
                              <h6 className="fw-bold mb-1" style={{ color: '#18352b' }}>
                                Priority {index + 1}
                              </h6>
                              <small className="text-secondary">
                                Among {filteredIssues.length} issues
                              </small>
                            </div>
                          </div>
                        </div>

                        {/* Dates and actions */}
                        <div
                          className="d-flex justify-content-between align-items-center flex-wrap gap-3 pt-3"
                          style={{ borderTop: '1px solid #e5ebe7' }}
                        >
                          <div className="d-flex flex-wrap align-items-center gap-4">
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                  backgroundColor: '#edf4f1',
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '12px',
                                  flexShrink: 0
                                }}
                              >
                                <i className="fa-regular fa-calendar" style={{ color: '#176b52', fontSize: '18px' }} />
                              </div>
                              <div>
                                <small className="text-secondary d-block">Reported on</small>
                                <span className="fw-semibold small">
                                  {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'Date not available'}
                                </span>
                              </div>
                            </div>

                            {issue.status === 'Resolved' && (
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="d-flex align-items-center justify-content-center"
                                  style={{
                                    backgroundColor: '#e4f7e9',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    flexShrink: 0
                                  }}
                                >
                                  <i className="fa-solid fa-circle-check" style={{ color: '#198754', fontSize: '18px' }} />
                                </div>
                                <div>
                                  <small className="text-secondary d-block">Resolved on</small>
                                  <span className="fw-semibold small">
                                    {issue.resolvedAt ? new Date(issue.resolvedAt).toLocaleDateString() : 'Resolution date not available'}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="d-flex gap-2 flex-wrap">
                            <Button
                              onClick={() => handleSupport(issue)}
                              disabled={issue.status === 'Resolved'}
                              variant={alreadySupported ? 'outline-success' : 'success'}
                              style={{ borderRadius: '9px' }}
                            >
                              <FaHeart className="me-2" />
                              {issue.status === 'Resolved'
                                ? 'Issue Resolved'
                                : alreadySupported
                                  ? 'Withdraw Support'
                                  : 'Support Issue'}
                            </Button>

                            {canDeleteIssue(issue) && (
                              <Button
                                variant="outline-danger"
                                onClick={() => handleDelete(issue)}
                                style={{ borderRadius: '9px' }}
                              >
                                <i className="fa-solid fa-trash me-2" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  )
                })}
              </div>
            )}
          </Container>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
