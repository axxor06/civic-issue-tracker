import { useEffect, useState } from 'react'
import {
  FaUsers,
  FaUserCheck,
  FaFileAlt,
  FaSearch,
  FaMapMarkerAlt,
  FaTimes,
  FaEnvelope,
  FaCalendarAlt,
  FaExclamationCircle,
  FaPhone,
  FaSpinner
} from 'react-icons/fa'
import { toast } from 'react-toastify'

import AdminLayout from '../Components/Admin/AdminLayout'
import StatusBadge from '../Components/Admin/StatusBadge'

import {
  getAllUsersAPI,
  getAllIssuesAPI,
  updateUserAPI
} from '../services/allAPI'


function AdminUsers() {


  const [users, setUsers] = useState([])
  const [issues, setIssues] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const [selectedUser, setSelectedUser] = useState(null)

  const [loading, setLoading] = useState(true)
  const [updatingUserId, setUpdatingUserId] = useState(null)



  useEffect(() => {

    const loadUsersData = async () => {

      try {

        setLoading(true)

        const [usersResponse, issuesResponse] = await Promise.all([
          getAllUsersAPI(),
          getAllIssuesAPI()
        ])

        const usersData = Array.isArray(usersResponse?.data)
          ? usersResponse.data
          : []

        const issuesData = Array.isArray(issuesResponse?.data)
          ? issuesResponse.data
          : []

        setUsers(usersData)
        setIssues(issuesData)

      } catch (error) {

        console.error('Admin users data error:', error)

        toast.error(
          'Unable to load community members'
        )

      } finally {

        setLoading(false)

      }
    }

    loadUsersData()

  }, [])


  const getUserIssues = (userId) => {

    return issues.filter(
      (issue) =>
        String(issue.reportedBy) === String(userId)
    )

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

  const getHighestPriority = (userId) => {

    const userIssues = getUserIssues(userId)

    if (userIssues.length === 0) {
      return '—'
    }

    const priorityOrder = {
      Critical: 4,
      High: 3,
      Medium: 2,
      Low: 1
    }

    return userIssues.reduce((highest, issue) => {

      const currentPriority =
        issue.priority || getIssuePriority(issue)

      if (
        priorityOrder[currentPriority] >
        priorityOrder[highest]
      ) {
        return currentPriority
      }

      return highest

    }, 'Low')
  }

  const activeUsers = users.filter(
    (user) => user.status === 'Active'
  ).length


  const reportingUsers = users.filter(
    (user) => getUserIssues(user.id).length > 0
  ).length


  const filteredUsers = users.filter((user) => {

    const name = user.name || ''
    const email = user.email || ''
    const location = user.location || ''

    const search = searchTerm.toLowerCase()

    const matchesSearch =
      name.toLowerCase().includes(search) ||
      email.toLowerCase().includes(search) ||
      location.toLowerCase().includes(search)

    const matchesStatus =
      statusFilter === 'All' ||
      user.status === statusFilter

    return matchesSearch && matchesStatus
  })


  const getUserInitials = (name = '') => {

    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }


  const formatDate = (dateValue) => {

    if (!dateValue) {
      return 'Not available'
    }

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return dateValue
    }

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }


  const getUserJoinDate = (user) => {

    return (
      user.createdAt ||
      user.joined ||
      user.created_at ||
      null
    )

  }


  const getUserPhone = (user) => {

    return (
      user.phone ||
      user.mobile ||
      user.phoneNumber ||
      null
    )

  }

  const openUserDetails = (user) => {

    setSelectedUser(user)

  }

  const closeUserDetails = () => {

    setSelectedUser(null)

  }

  const toggleUserStatus = async (userId) => {

    const currentUser = users.find(
      (user) => String(user.id) === String(userId)
    )

    if (!currentUser) {
      return
    }

    const newStatus =
      currentUser.status === 'Active'
        ? 'Inactive'
        : 'Active'


    try {

      setUpdatingUserId(userId)


      // Update backend
      const response = await updateUserAPI(
        userId,
        {
          status: newStatus
        }
      )


      const updatedUser = response?.data


      // Update local users list
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          String(user.id) === String(userId)
            ? {
              ...user,
              ...(updatedUser || {}),
              status: newStatus
            }
            : user
        )
      )


      // Update currently opened modal
      setSelectedUser((currentSelectedUser) => {

        if (
          !currentSelectedUser ||
          String(currentSelectedUser.id) !== String(userId)
        ) {
          return currentSelectedUser
        }

        return {
          ...currentSelectedUser,
          ...(updatedUser || {}),
          status: newStatus
        }

      })


      toast.success(
        `Account ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`
      )


    } catch (error) {

      console.error(
        'User status update error:',
        error
      )

      toast.error(
        'Unable to update account status'
      )

    } finally {

      setUpdatingUserId(null)

    }

  }

  if (loading) {

    return (
      <AdminLayout>

        <div className="admin-loading">

          <div className="admin-loading-icon">
            <FaUsers />
          </div>

          <p>
            Loading community members...
          </p>

        </div>

      </AdminLayout>
    )

  }


  return (

    <AdminLayout>

      <div className="admin-users-page">

        <div className="users-page-heading">

          <div>

            <span className="dashboard-eyebrow">
              USER MANAGEMENT
            </span>

            <h1>
              Community Members
            </h1>

            <p>
              Manage community members and review
              their reporting activity.
            </p>

          </div>


          <div className="users-heading-icon">
            <FaUsers />
          </div>

        </div>

        <div className="users-summary-grid">


          {/* TOTAL USERS */}

          <div className="users-summary-card">

            <div className="users-summary-icon total">
              <FaUsers />
            </div>

            <div>

              <p>
                Total Users
              </p>

              <h2>
                {users.length}
              </h2>

              <span>
                Registered community members
              </span>

            </div>

          </div>


          {/* ACTIVE USERS */}

          <div className="users-summary-card">

            <div className="users-summary-icon active">
              <FaUserCheck />
            </div>

            <div>

              <p>
                Active Users
              </p>

              <h2>
                {activeUsers}
              </h2>

              <span>
                Currently active accounts
              </span>

            </div>

          </div>


          {/* REPORTING USERS */}

          <div className="users-summary-card">

            <div className="users-summary-icon reports">
              <FaFileAlt />
            </div>

            <div>

              <p>
                Reporting Users
              </p>

              <h2>
                {reportingUsers}
              </h2>

              <span>
                Members who reported issues
              </span>

            </div>

          </div>


        </div>

        <section className="admin-panel users-table-panel">

          {/* TABLE HEADING */}

          <div className="users-table-heading">

            <div>

              <h3>
                Community Members
              </h3>

              <p>
                Search, review, and manage registered users.
              </p>

            </div>


            <span className="users-count-badge">
              {filteredUsers.length} users
            </span>

          </div>


          <div className="users-toolbar">

            {/* SEARCH */}

            <div className="users-search-box">

              <FaSearch />

              <input
                type="text"
                placeholder="Search by name, email, or location..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

            </div>


            {/* STATUS FILTER */}

            <select
              className="users-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              aria-label="Filter users by status"
            >

              <option value="All">
                All Accounts
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>


          </div>

          <div className="admin-table-wrapper">

            <table className="admin-issues-table admin-users-table">


              <thead>

                <tr>

                  <th>
                    Name & Email
                  </th>

                  <th>
                    Account Role
                  </th>

                  <th>
                    Reports
                  </th>

                  <th>
                    Highest Priority
                  </th>

                  <th>
                    Account Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>


                {filteredUsers.map((user) => {

                  const userIssueCount =
                    getUserIssues(user.id).length

                  const highestPriority =
                    getHighestPriority(user.id)


                  return (

                    <tr key={user.id}>


                      {/* USER */}

                      <td>

                        <div className="user-member-cell">


                          <div className="user-initials">

                            {getUserInitials(
                              user.name
                            )}

                          </div>


                          <div className="user-member-info">

                            <strong>
                              {user.name || 'Unnamed User'}
                            </strong>

                            <span>
                              {user.email || 'No email available'}
                            </span>

                          </div>


                        </div>

                      </td>


                      {/* Role */}

                      <td>

                        <span className="user-location">

                          {user.role === 'admin' ? "Administrator" : 'Community Member'}

                        </span>

                      </td>


                      {/* REPORTS */}

                      <td>

                        <span className="user-report-count">

                          {userIssueCount}

                        </span>

                      </td>


                      {/* HIGHEST PRIORITY */}

                      <td>

                        {highestPriority === '—' ? (

                          <span className="user-no-priority">
                            —
                          </span>

                        ) : (

                          <span
                            className={`issue-priority ${highestPriority.toLowerCase()}`}
                          >

                            {highestPriority}

                          </span>

                        )}

                      </td>


                      {/* ACCOUNT STATUS */}

                      <td>

                        <span
                          className={`user-account-status ${(user.status || 'Active').toLowerCase()
                            }`}
                        >

                          <span className="user-status-dot"></span>

                          {user.status || 'Active'}

                        </span>

                      </td>


                      {/* ACTION */}

                      <td>

                        <button
                          type="button"
                          className="user-view-button"
                          onClick={() =>
                            openUserDetails(user)
                          }
                        >

                          View Details

                        </button>

                      </td>


                    </tr>

                  )

                })}


                {/* EMPTY STATE */}

                {filteredUsers.length === 0 && (

                  <tr>

                    <td
                      colSpan="6"
                      className="users-empty-state"
                    >

                      No users found.
                      Try a different search or filter.

                    </td>

                  </tr>

                )}


              </tbody>

            </table>

          </div>


        </section>


        {selectedUser && (

          <div
            className="users-modal-overlay"
            onClick={closeUserDetails}
          >


            <section
              className="users-modal-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="users-modal-title"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="users-modal-header">


                <div className="users-modal-header-text">

                  <span className="users-modal-kicker">
                    CIVICPULSE / USER MANAGEMENT
                  </span>

                  <h2 id="users-modal-title">
                    Member Profile
                  </h2>

                  <p>
                    Account information and community contributions
                  </p>

                </div>


                <button
                  type="button"
                  className="users-modal-close"
                  onClick={closeUserDetails}
                  aria-label="Close modal"
                >

                  <FaTimes />

                </button>


              </div>


              <div className="users-modal-profile">


                <div className="users-modal-avatar">

                  {getUserInitials(
                    selectedUser.name
                  )}

                </div>


                <div className="users-modal-identity">


                  <h3>
                    {selectedUser.name ||
                      'Unnamed User'}
                  </h3>


                  <p>
                    {selectedUser.email ||
                      'No email available'}
                  </p>


                  <span
                    className={`users-modal-status ${(selectedUser.status || 'Active')
                        .toLowerCase()
                      }`}
                  >

                    <span className="users-modal-status-dot"></span>

                    {selectedUser.status || 'Active'}
                    {' '}Account

                  </span>


                </div>


                <div className="users-modal-member-id">

                  <span>
                    MEMBER ID
                  </span>

                  <strong>
                    CP-
                    {String(selectedUser.id)
                      .padStart(4, '0')}
                  </strong>

                </div>


              </div>


              <div className="users-modal-body">


                <div className="users-modal-section-heading">

                  <h3>
                    Personal Information
                  </h3>

                  <span>
                    Account overview
                  </span>

                </div>


                <div className="users-modal-info-grid">


                  {/* EMAIL */}

                  <div className="users-modal-info-card">

                    <span className="users-modal-info-icon">
                      <FaEnvelope />
                    </span>

                    <div>

                      <span className="users-modal-info-label">
                        Email Address
                      </span>

                      <strong>
                        {selectedUser.email ||
                          'Not available'}
                      </strong>

                    </div>

                  </div>


                  {/* Role */}
                  
                  <div className="users-modal-info-card">
                    <span className="users-modal-info-icon">
                      <FaUsers />
                    </span>
                    <div>
                      <span className="users-modal-info-label">
                        Account Role
                      </span>
                      <strong>
                        {selectedUser.role === 'admin'
                          ? 'Administrator'
                          : 'Community Member'}
                      </strong>
                    </div>
                  </div>


                  {/* REPORTS */}

                  <div className="users-modal-info-card">

                    <span className="users-modal-info-icon">
                      <FaExclamationCircle />
                    </span>

                    <div>

                      <span className="users-modal-info-label">
                        Total Reports
                      </span>

                      <strong>

                        {getUserIssues(
                          selectedUser.id
                        ).length}

                        {' '}

                        {getUserIssues(
                          selectedUser.id
                        ).length === 1
                          ? 'report submitted'
                          : 'reports submitted'}

                      </strong>

                    </div>

                  </div>


                  {/* PHONE */}

                  {getUserPhone(selectedUser) && (

                    <div className="users-modal-info-card">

                      <span className="users-modal-info-icon">
                        <FaPhone />
                      </span>

                      <div>

                        <span className="users-modal-info-label">
                          Phone Number
                        </span>

                        <strong>
                          {getUserPhone(
                            selectedUser
                          )}
                        </strong>

                      </div>

                    </div>

                  )}


                  {/* HIGHEST PRIORITY */}

                  <div className="users-modal-info-card">

                    <span className="users-modal-info-icon">
                      <FaExclamationCircle />
                    </span>

                    <div>

                      <span className="users-modal-info-label">
                        Highest Issue Priority
                      </span>

                      <strong>
                        {getHighestPriority(
                          selectedUser.id
                        )}
                      </strong>

                    </div>

                  </div>


                </div>

                <div className="users-modal-reports-section">

                  <div className="users-modal-section-heading">

                    <h3>
                      Reported Issues
                    </h3>

                    <span>

                      {getUserIssues(
                        selectedUser.id
                      ).length}

                      {' '}

                      {getUserIssues(
                        selectedUser.id
                      ).length === 1
                        ? 'record'
                        : 'records'}

                    </span>

                  </div>


                  {getUserIssues(selectedUser.id).length > 0 ? (

                    <div className="users-modal-report-list">


                      {getUserIssues(
                        selectedUser.id
                      ).map((issue, index) => {


                        const issuePriority =
                          issue.priority ||
                          getIssuePriority(issue)


                        return (

                          <div
                            className="users-modal-report-item"
                            key={`${selectedUser.id}-${issue.id || index}`}
                          >


                            <div className="users-modal-report-main">


                              <span className="users-modal-report-number">

                                {String(index + 1)
                                  .padStart(2, '0')}

                              </span>


                              <div className="users-modal-report-details">


                                <strong>
                                  {issue.title ||
                                    'Untitled issue'}
                                </strong>


                                <div
                                  className="users-modal-report-status"
                                >

                                  <StatusBadge
                                    status={
                                      issue.status ||
                                      'Pending'
                                    }
                                  />

                                </div>


                              </div>


                            </div>


                            <span
                              className={`users-modal-priority ${issuePriority.toLowerCase()}`}
                            >

                              {issuePriority}

                            </span>


                          </div>

                        )

                      })}


                    </div>

                  ) : (


                    <div className="users-modal-empty">

                      <FaFileAlt />

                      <p>
                        No reported issues from this member yet.
                      </p>

                    </div>


                  )}


                </div>


              </div>


              <div className="users-modal-footer">


                <p>

                  <span className="users-modal-demo-dot"></span>

                  Account status changes are saved to the backend.

                </p>


                <div className="users-modal-footer-actions">


                  {/* CLOSE */}

                  <button
                    type="button"
                    className="users-modal-cancel"
                    onClick={closeUserDetails}
                  >

                    Close

                  </button>


                  {/* ACTIVATE / DEACTIVATE */}

                  <button
                    type="button"
                    className={`users-modal-account-button ${selectedUser.status === 'Active'
                        ? 'deactivate'
                        : 'activate'
                      }`}
                    onClick={() =>
                      toggleUserStatus(
                        selectedUser.id
                      )
                    }
                    disabled={
                      updatingUserId === selectedUser.id
                    }
                  >


                    {updatingUserId === selectedUser.id ? (

                      <>
                        <FaSpinner className="user-button-spinner" />

                        Updating...

                      </>

                    ) : (

                      selectedUser.status === 'Active'
                        ? 'Deactivate Account'
                        : 'Activate Account'

                    )}


                  </button>


                </div>


              </div>


            </section>

          </div>

        )}


      </div>

    </AdminLayout>

  )

}

export default AdminUsers