import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import {
  getAllUsersAPI,
  getAllIssuesAPI,
  updateIssueAPI
} from '../services/allAPI'

import AdminLayout from '../Components/Admin/AdminLayout'
import StatusBadge from '../Components/Admin/StatusBadge'

import {
  FaMapMarkerAlt,
  FaUsers,
  FaThumbsUp,
  FaEye,
  FaTimes,
  FaExclamationCircle,
  FaClipboardList
} from 'react-icons/fa'


const priorityFilters = ['All', 'Critical', 'High', 'Medium', 'Low']

const statusOptions = [
  'Pending',
  'Reported',
  'Under Review',
  'Approved',
  'Assigned',
  'In Progress',
  'Resolved',
  'Rejected'
]

function AdminIssues() {

  const [issues, setIssues] = useState([])
  const [users, setUsers] = useState([])

  const [activeFilter, setActiveFilter] = useState('All')

  const [selectedIssue, setSelectedIssue] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [adminNote, setAdminNote] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  const [loading, setLoading] = useState(true)

  // API loading function
  useEffect(() => {
    const loadIssuesData = async () => {
      try {
        setLoading(true)

        const [issuesResponse, usersResponse] = await Promise.all([
          getAllIssuesAPI(),
          getAllUsersAPI()
        ])

        const issuesData = Array.isArray(issuesResponse?.data)
          ? issuesResponse.data
          : []

        const usersData = Array.isArray(usersResponse?.data)
          ? usersResponse.data
          : []

        setIssues(issuesData)
        setUsers(usersData)
      } catch (error) {
        console.error('Admin issues data error:', error)

        toast.error('Unable to load community issues')
      } finally {
        setLoading(false)
      }
    }

    loadIssuesData()
  }, [])


  const getReporterName = (reportedBy) => {
    const reporter = users.find(
      (user) => String(user.id) === String(reportedBy)
    )

    return reporter?.name || 'Unknown user'
  }

  const getIssuePriority = (issue) => {
    const supporterCount = Array.isArray(issue.supporters)
      ? issue.supporters.length
      : 0

    if (supporterCount >= 5) {
      return 'Critical'
    }

    if (supporterCount >= 3) {
      return 'High'
    }

    if (supporterCount >= 1) {
      return 'Medium'
    }

    return 'Low'
  }


  const getIssueScore = (issue) => {
    const supporterCount = Array.isArray(issue.supporters)
      ? issue.supporters.length
      : 0

    return Math.min(supporterCount * 20, 100)
  }


  const displayIssues = useMemo(() => {
    return issues.map((issue) => {
      const supporters = Array.isArray(issue.supporters)
        ? issue.supporters
        : []

      return {
        ...issue,

        displayId: `CP-${issue.id}`,

        reporter: getReporterName(issue.reportedBy),

        date: issue.createdAt
          ? new Date(issue.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
          : 'Unknown date',

        priority: getIssuePriority(issue),

        score: getIssueScore(issue),

        supportersCount: supporters.length,

        affected: supporters.length
      }
    })
  }, [issues, users])


  const filteredIssues = useMemo(() => {
    return displayIssues
      .filter(
        (issue) =>
          activeFilter === 'All' ||
          issue.priority === activeFilter
      )
      .sort((a, b) => b.score - a.score)
  }, [displayIssues, activeFilter])


  const openIssueDetails = (issue) => {
    setSelectedIssue(issue)
    setSelectedStatus(issue.status || 'Pending')
    setAdminNote(issue.adminNote || '')
    setSaveMessage('')
  }

  const closeIssueDetails = () => {
    setSelectedIssue(null)
    setSaveMessage('')
  }

  const saveIssueUpdate = async (event) => {
    event.preventDefault()

    if (!selectedIssue) {
      return
    }

    try {
      setSaveMessage('Saving update...')

      const updateData = {
        status: selectedStatus,
        adminNote: adminNote
      }

      const response = await updateIssueAPI(
        selectedIssue.id,
        updateData
      )

      const updatedIssue = response?.data

      // Update the issue list on the admin page
      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          String(issue.id) === String(selectedIssue.id)
            ? {
              ...issue,
              ...updatedIssue
            }
            : issue
        )
      )

      toast.success(
        'Issue status updated successfully'
      )

      // Automatically close the modal
     closeIssueDetails()

    } 
    catch (error) {

      console.error(
        'Issue update error:',
        error
      )

      setSaveMessage(
        'Unable to update the issue. Please try again.'
      )

      toast.error(
        'Failed to update issue'
      )
    }
  }

  const priorityCounts = {
    All: displayIssues.length,

    Critical: displayIssues.filter(
      (issue) => issue.priority === 'Critical').length,

    High: displayIssues.filter(
      (issue) => issue.priority === 'High').length,

    Medium: displayIssues.filter(
      (issue) => issue.priority === 'Medium').length,

    Low: displayIssues.filter(
      (issue) => issue.priority === 'Low').length
  }

  const getDisplayStatus = (status) => {
    return status || 'Pending'
  }


  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="admin-loading-icon">
            <FaClipboardList />
          </div>

          <p>Loading community issues...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-issues-page">
        <section className="issues-page-heading">
          <div>
            <span className="dashboard-eyebrow">ISSUE MANAGEMENT</span>
            <h1>Community Issues</h1>
            <p>
              Review reported problems, assess community impact and manage
              resolution progress.
            </p>
          </div>

          <div className="issues-total-card">
            <div className="issues-total-icon">
              <FaClipboardList />
            </div>
            <div>
              <span>Total Issues</span>
              <strong>{issues.length}</strong>
            </div>
          </div>
        </section>

        <section className="issues-summary-grid">
          {[
            {
              label: 'Critical',
              count: priorityCounts.Critical,
              color: 'critical'
            },
            {
              label: 'High Priority',
              count: priorityCounts.High,
              color: 'high'
            },
            {
              label: 'Medium Priority',
              count: priorityCounts.Medium,
              color: 'medium'
            },
            {
              label: 'Low Priority',
              count: priorityCounts.Low,
              color: 'low'
            }
          ].map((item) => (
            <div className="issues-summary-card" key={item.label}>
              <span className={`summary-priority-dot ${item.color}`} />
              <span>{item.label}</span>
              <strong>{item.count}</strong>
            </div>
          ))}
        </section>

        <section className="admin-panel issues-list-panel">
          <div className="admin-panel-heading issues-list-heading">
            <div>
              <h3>Reported Issues</h3>
              <p>
                Issues are ordered by priority score, highest first.
              </p>
            </div>

            <span className="issues-results-count">
              {filteredIssues.length} shown
            </span>
          </div>

          <div className="issue-filter-bar">
            {priorityFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`issue-filter-button ${activeFilter === filter ? 'active' : ''
                  }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
                <span>{priorityCounts[filter]}</span>
              </button>
            ))}
          </div>

          <div className="admin-issue-cards">
            {filteredIssues.map((issue) => (
              <article className="admin-issue-card" key={issue.id}>
                <div className="issue-card-top">
                  <div className="issue-card-category">
                    <span className="issue-card-icon">
                      <FaExclamationCircle />
                    </span>
                    <div>
                      <span className="issue-card-id">{issue.displayId}</span>
                      <span className="issue-category-name">
                        {issue.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`priority-badge ${issue.priority.toLowerCase()}`}
                  >
                    {issue.priority}
                  </span>
                </div>

                <h3 className="issue-card-title">{issue.title}</h3>
                <p className="issue-card-description">
                  {issue.description}
                </p>

                <div className="issue-card-location">
                  <FaMapMarkerAlt />
                  <span>{issue.location}</span>
                </div>

                <div className="issue-card-metrics">
                  <div>
                    <span>Priority score</span>
                    <strong className="issue-score">{issue.score}/100</strong>
                  </div>
                  <div>
                    <span>People affected</span>
                    <strong>
                      <FaUsers /> {issue.affected}
                    </strong>
                  </div>
                  <div>
                    <span>Supporters</span>
                    <strong>
                      <FaThumbsUp /> {issue.supportersCount}
                    </strong>
                  </div>
                </div>

                <div className="issue-card-footer">
                  <div className="issue-card-meta">
                    <StatusBadge status={getDisplayStatus(issue.status)} />
                  </div>

                  <button
                    className="issue-details-button"
                    type="button"
                    onClick={() => openIssueDetails(issue)}
                  >
                    <FaEye />
                    View Details
                  </button>
                </div>
              </article>
            ))}

            {filteredIssues.length === 0 && (
              <div className="issues-empty-state">
                <FaClipboardList />
                <h3>No issues found</h3>
                <p>There are no issues under this priority yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {selectedIssue && (
        <div
          className="issue-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeIssueDetails()
            }
          }}
        >
          <section
            className="issue-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="issue-modal-title"
          >
            <div className="issue-modal-header">
              <div>
                <span className="issue-card-id">{selectedIssue.displayId}</span>
                <h2 id="issue-modal-title">{selectedIssue.title}</h2>
                <p>{selectedIssue.category}</p>
              </div>

              <button
                className="issue-modal-close"
                type="button"
                onClick={closeIssueDetails}
                aria-label="Close issue details"
              >
                <FaTimes />
              </button>
            </div>

            <div className="issue-modal-body">
              <div className="issue-modal-badges">
                <span
                  className={`priority-badge ${selectedIssue.priority.toLowerCase()}`}
                >
                  {selectedIssue.priority} Priority
                </span>
                <StatusBadge status={selectedStatus} />
              </div>

              <p className="issue-modal-description">
                {selectedIssue.description}
              </p>

              <div className="issue-modal-info-grid">
                <div>
                  <span>Location</span>
                  <strong>{selectedIssue.location}</strong>
                </div>
                <div>
                  <span>Reported by</span>
                  <strong>{selectedIssue.reporter}</strong>
                </div>
                <div>
                  <span>Date reported</span>
                  <strong>{selectedIssue.date}</strong>
                </div>
                <div>
                  <span>Priority score</span>
                  <strong>{selectedIssue.score}/100</strong>
                </div>
                <div>
                  <span>People affected</span>
                  <strong>{selectedIssue.affected}</strong>
                </div>
                <div>
                  <span>Community supporters</span>
                  <strong>{selectedIssue.supportersCount}</strong>
                </div>
              </div>

              <form onSubmit={saveIssueUpdate} className="issue-admin-form">
                <h3>Admin Actions</h3>

                <label htmlFor="issue-status-select">
                  Update issue status
                </label>
                <select
                  id="issue-status-select"
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <label htmlFor="issue-admin-note">Admin update / note</label>
                <textarea
                  id="issue-admin-note"
                  rows="3"
                  placeholder="Add an update about the action taken..."
                  value={adminNote}
                  onChange={(event) => setAdminNote(event.target.value)}
                />

                {saveMessage && (
                  <p className="issue-save-message">{saveMessage}</p>
                )}

                <div className="issue-modal-actions">
                  <button
                    className="issue-cancel-button"
                    type="button"
                    onClick={closeIssueDetails}
                  >
                    Close
                  </button>

                  <button className="issue-save-button" type="submit">
                    Save &amp; Notify User
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminIssues
