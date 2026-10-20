import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAllIssuesAPI } from '../services/allAPI'
import { getLoggedUser } from '../utils/auth'

// Top summary cards
const SUMMARY_CARDS = [
  {
    label: 'Total Reports',
    key: 'All',
    icon: '▤',
    className: 'total',
  },
  {
    label: 'Resolved',
    key: 'Resolved',
    icon: '✓',
    className: 'resolved',
  },
  {
    label: 'In Progress',
    key: 'In Progress',
    icon: '↻',
    className: 'in-progress',
  },
  {
    label: 'Pending',
    key: 'Pending',
    icon: '◷',
    className: 'under-review',
  },
  {
    label: 'Rejected',
    key: 'Rejected',
    icon: '×',
    className: 'rejected',
  },
]

// Details for report statuses
const STATUS_DETAILS = {
  'Under Review': {
    icon: '◷',
    className: 'under-review',
  },
  Approved: {
    icon: '✓',
    className: 'approved',
  },
  Assigned: {
    icon: '♙',
    className: 'assigned',
  },
  'In Progress': {
    icon: '↻',
    className: 'in-progress',
  },
  Resolved: {
    icon: '✓',
    className: 'resolved',
  },
  Rejected: {
    icon: '×',
    className: 'rejected',
  },
}

// Convert API statuses into display statuses
const getDisplayStatus = (status) => {
  const normalized = String(status || 'Pending')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')

  const statusMap = {
    pending: 'Under Review',
    'under review': 'Under Review',
    approved: 'Approved',
    assigned: 'Assigned',
    'in progress': 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
  }

  return statusMap[normalized] || 'Under Review'
}

// Format report date
const formatDate = (date) => {
  if (!date) return 'Date unavailable'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date unavailable'
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Identify pending reports
const isPending = (report) => {
  const status = String(report.status || 'Pending')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')

  return status === 'pending' || status === 'under review'
}

function UserReports() {
  const user = getLoggedUser()

  const [reports, setReports] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch reports belonging to the logged-in user
  useEffect(() => {
    let active = true

    const loadReports = async () => {
      if (!user?.id) {
        if (active) {
          setError('Please log in to view your reports.')
          setLoading(false)
        }
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await getAllIssuesAPI()

        // Support different API response formats
        const allIssues = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.data?.issues)
              ? response.data.issues
              : []

        // Keep only reports submitted by the logged-in user
        const myReports = allIssues.filter(
          (issue) =>
            issue.reportedBy != null &&
            String(issue.reportedBy) === String(user.id)
        )

        if (active) {
          setReports(myReports)
        }
      } catch (err) {
        if (active) {
          setError('Unable to load your reports. Please try again.')
          toast.error('Failed to load your reports.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadReports()

    return () => {
      active = false
    }
  }, [user?.id])

  // Calculate the count for each summary card
  const getCount = (key) => {
    if (key === 'All') {
      return reports.length
    }

    if (key === 'Pending') {
      return reports.filter(isPending).length
    }

    return reports.filter(
      (report) => getDisplayStatus(report.status) === key
    ).length
  }

  // Filter reports when a summary card is selected
  const visibleReports =
    selectedStatus === 'All'
      ? reports
      : selectedStatus === 'Pending'
        ? reports.filter(isPending)
        : reports.filter(
            (report) =>
              getDisplayStatus(report.status) === selectedStatus
          )

  // Login required
  if (!user?.id) {
    return (
      <main className="user-reports-page">
        <div className="user-reports-container">
          <div className="reports-message">
            <h2>Please log in</h2>
            <p>Log in to view the issues you have reported.</p>

            <Link to="/login" className="reports-primary-btn">
              Go to login
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="user-reports-page">
      <div className="user-reports-container">

        {/* Page heading */}
        <div className="user-reports-heading">
          <div>
            <p className="reports-eyebrow">
              CIVIC ISSUE TRACKER
            </p>

            <h1>My Reports</h1>

            <p className="reports-description">
              Track the progress of the issues you have reported.
            </p>
          </div>

          <Link
            to="/report-issue"
            className="reports-primary-btn"
          >
            + Report New Issue
          </Link>
        </div>

        {/* Top summary cards */}
        <section
          className="reports-summary"
          aria-label="Report summary"
        >
          {SUMMARY_CARDS.map((card) => (
            <button
              type="button"
              key={card.key}
              className={`report-summary-card ${card.className} ${
                selectedStatus === card.key
                  ? 'summary-selected'
                  : ''
              }`}
              onClick={() => setSelectedStatus(card.key)}
              aria-pressed={selectedStatus === card.key}
            >
              <span className="summary-card-top">
                <span
                  className="summary-card-icon"
                  aria-hidden="true"
                >
                  {card.icon}
                </span>

                <span className="summary-card-label">
                  {card.label}
                </span>
              </span>

              <span className="summary-card-count">
                {loading ? '—' : getCount(card.key)}
              </span>

              <span className="summary-card-caption">
                {getCount(card.key) === 1
                  ? 'Report'
                  : 'Reports'}
              </span>
            </button>
          ))}
        </section>

        {/* Report list */}
        <section className="my-reports-list">
          <div className="my-reports-list-heading">
            <div>
              <h2>
                {selectedStatus === 'All'
                  ? 'Your submitted issues'
                  : selectedStatus === 'Pending'
                    ? 'Pending Reports'
                    : selectedStatus}
              </h2>

              <p>
                {loading
                  ? 'Loading your reports...'
                  : `${visibleReports.length} ${
                      visibleReports.length === 1
                        ? 'report'
                        : 'reports'
                    }`}
              </p>
            </div>

            {selectedStatus !== 'All' && (
              <button
                type="button"
                className="reports-clear-filter"
                onClick={() => setSelectedStatus('All')}
              >
                View all
              </button>
            )}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="reports-message">
              <p>Loading your reports...</p>
            </div>
          ) : error ? (
            /* Error state */
            <div className="reports-message reports-error-message">
              <h3>Could not load reports</h3>
              <p>{error}</p>

              <button
                type="button"
                className="reports-primary-btn"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          ) : visibleReports.length === 0 ? (
            /* Empty state */
            <div className="reports-message">
              <div
                className="reports-empty-icon"
                aria-hidden="true"
              >
                ▤
              </div>

              <h3>
                {selectedStatus === 'All'
                  ? 'No reports yet'
                  : `No ${selectedStatus.toLowerCase()} reports`}
              </h3>

              <p>
                {selectedStatus === 'All'
                  ? 'When you report a community issue, it will appear here.'
                  : 'You have no reports with this status right now.'}
              </p>

              {selectedStatus === 'All' ? (
                <Link
                  to="/report-issue"
                  className="reports-primary-btn"
                >
                  Report your first issue
                </Link>
              ) : (
                <button
                  type="button"
                  className="reports-primary-btn"
                  onClick={() => setSelectedStatus('All')}
                >
                  View all reports
                </button>
              )}
            </div>
          ) : (
            /* Display report cards */
            <div className="my-reports-cards">
              {visibleReports.map((report) => {
                const status = getDisplayStatus(report.status)
                const details = STATUS_DETAILS[status]

                return (
                  <article
                    className="my-report-card"
                    key={report.id}
                  >
                    <div className="my-report-card-header">
                      <div className="my-report-title-group">
                        <span
                          className={`my-report-category-icon ${details.className}`}
                          aria-hidden="true"
                        >
                          {details.icon}
                        </span>

                        <div>
                          <h3>
                            {report.title || 'Untitled issue'}
                          </h3>

                          <p className="my-report-category">
                            {report.category || 'Uncategorized'}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`report-status-badge ${details.className}`}
                      >
                        {status}
                      </span>
                    </div>

                    <p className="my-report-description">
                      {report.description ||
                        'No description provided.'}
                    </p>

                    <div className="my-report-meta">
                      <span>
                        <strong>Location:</strong>{' '}
                        {report.location || 'Not specified'}
                      </span>

                      <span>
                        <strong>Reported:</strong>{' '}
                        {formatDate(report.createdAt)}
                      </span>
                    </div>

                    {report.adminResponse && (
                      <div className="my-report-response">
                        <strong>Admin response</strong>
                        <p>{report.adminResponse}</p>
                      </div>
                    )}

                    <div className="my-report-footer">
                      <span>
                        Report ID: {report.id}
                      </span>

                      <span className="my-report-footer-status">
                        {status}
                      </span>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default UserReports