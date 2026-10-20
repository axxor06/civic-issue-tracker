import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import {
  getAllUsersAPI,
  getAllIssuesAPI
} from '../services/allAPI'

import { getLoggedUser } from '../utils/auth'

import AdminLayout from '../Components/Admin/AdminLayout'

import StatusBadge from '../Components/Admin/StatusBadge'

import {
  FaClipboardList,
  FaExclamationTriangle,
  FaSpinner,
  FaCheckCircle,
  FaArrowUp,
  FaMapMarkerAlt,
  FaClock,
  FaExclamation 
} from 'react-icons/fa'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)


// chart section
const barChartOptions = {

  responsive: true,

  maintainAspectRatio: false,

  animation: false,

  plugins: {

    legend: {
      display: false
    },

    tooltip: {

      backgroundColor: '#173b32',

      padding: 10,

      callbacks: {

        label: function (context) {

          return `Issues: ${context.raw}`

        }

      }

    }

  },

  layout: {

    padding: {
      top: 8,
      bottom: 0,
      left: 0,
      right: 0
    }

  },

  scales: {

    x: {

      stacked: false,

      grid: {
        display: false,
        drawBorder: false
      },

      border: {
        display: false
      },

      ticks: {

        color: '#74827a',

        font: {
          size: 10
        },

        maxRotation: 0,

        minRotation: 0

      }

    },

    y: {

      stacked: false,

      beginAtZero: true,

      border: {
        display: false
      },

      grid: {

        color: '#e9efeb',

        drawBorder: false

      },

      ticks: {

        color: '#74827a',

        precision: 0,

        maxTicksLimit: 6

      }

    }

  }

}


const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,

  plugins: {
    legend: {
      display: false
    },

    tooltip: {
      backgroundColor: '#173b32',
      padding: 10
    }
  },

  layout: {
    padding: 8
  }
}

const barColors = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#06B6D4',
  '#F97316',
  '#64748B'
]

const barHoverColors = [
  '#2563EB',
  '#059669',
  '#D97706',
  '#7C3AED',
  '#0891B2',
  '#EA580C',
  '#475569'
]


function AdminDashboard() {


  // looged in admin
  const loggedUser = getLoggedUser()
  const userName = loggedUser?.name || 'Administrator'

  // states
  const [users, setUsers] = useState([])
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)


  // load actual data
  useEffect(() => {

    const loadDashboardData = async () => {

      try {

        setLoading(true)

        const [
          usersResponse,
          issuesResponse
        ] = await Promise.all([
          getAllUsersAPI(),
          getAllIssuesAPI()
        ])

        // Make sure the API returned arrays
        const usersData = Array.isArray(usersResponse?.data) ? usersResponse.data : []

        const issuesData = Array.isArray(issuesResponse?.data) ? issuesResponse.data : []

        setUsers(usersData)
        setIssues(issuesData)

      }
      catch (error) {

        console.error('Dashboard data error:', error)

        toast.error('Unable to load dashboard data')

      }
      finally {

        setLoading(false)

      }
    }

    loadDashboardData()

  }, [])

  // basic issue counts
  const totalIssues = issues.length

  const resolvedIssues = issues.filter(issue => issue.status === 'Resolved').length

  const inProgressIssues = issues.filter(issue => issue.status === 'In Progress').length

  const pendingIssues = issues.filter(issue => issue.status === 'Pending').length

  const approvedIssues = issues.filter(issue => issue.status === 'Approved').length

  const rejectedIssues = issues.filter(issue => issue.status === 'Rejected').length


  //stat cards
  const stats = [

    {
      title: 'Total Issues',
      value: totalIssues,
      note: 'Community reports received',
      icon: FaClipboardList,
      color: 'green'
    },

    {
      title: 'Pending Issues',
      value: pendingIssues,
      note: 'Waiting for action',
      icon: FaExclamationTriangle,
      color: 'red'
    },

    {
      title: 'In Progress',
      value: inProgressIssues,
      note: 'Currently being addressed',
      icon: FaSpinner,
      color: 'orange'
    },

    {
      title: 'Resolved',
      value: resolvedIssues,
      note: 'Issues successfully resolved',
      icon: FaCheckCircle,
      color: 'blue'
    },

    {
      title: 'Rejected',
      value: rejectedIssues,
      note: 'Issues rejected',
      icon: FaExclamation,
      color: 'red'
    }

  ]

  //category data
  const categoryCounts = {}

  issues.forEach((issue) => {

    const category = issue.category || 'Other'
    categoryCounts[category] = (categoryCounts[category] || 0) + 1

  })

  const categoryData = Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        issues: count
      }))

  // status data
  const statusList = [
    {
      name: 'Pending',
      color: '#F59E0B'
    },
    {
      name: 'Reported',
      color: '#2563EB'
    },
    {
      name: 'Under Review',
      color: '#7C3AED'
    },
    {
      name: 'Approved',
      color: '#16A34A'
    },
    {
      name: 'Assigned',
      color: '#0891B2'
    },
    {
      name: 'In Progress',
      color: '#4F46E5'
    },
    {
      name: 'Resolved',
      color: '#059669'
    },
    {
      name: 'Rejected',
      color: '#DC2626'
    }
  ]

  const statusData = statusList.map((status) => ({
    name: status.name,

    value: issues.filter(
      (issue) => issue.status === status.name
    ).length,

    color: status.color
  }))

  // bar chart data
  const categories = [
    'Road',
    'Streetlight',
    'Waste',
    'Electricity',
    'Water',
    'Noise',
    'Other'
  ]

  const barChartData = {
    labels: categories,

    datasets: [
      {
        label: 'Issues',

        data: categories.map((category) => {
          return issues.filter(
            (issue) =>
              issue.category?.toLowerCase() === category.toLowerCase()
          ).length
        }),

        backgroundColor: barColors,

        hoverBackgroundColor: barHoverColors,

        borderRadius: 5,
        borderSkipped: false,

        maxBarThickness: 42
      }
    ]
  }

  //pie chart data
  const pieChartData = {
    labels: statusData.map((item) => item.name),

    datasets: [
      {
        data: statusData.map((item) => item.value),

        backgroundColor: statusData.map(
          (item) => item.color
        ),

        hoverOffset: 2,

        borderWidth: 1,

        borderColor: '#ffffff'
      }
    ]
  }


  const recentActivity = [...issues]

    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )

    .slice(0, 5)

    .map((issue) => {

      const reporter =
        users.find(
          user =>
            String(user.id) ===
            String(issue.reportedBy)
        )


      // Determine what happened
      let action = 'Issue reported'

      let activityTime =
        issue.createdAt


      if (
        issue.status === 'Resolved' &&
        issue.resolvedAt
      ) {

        action = 'Issue resolved'

        activityTime =
          issue.resolvedAt

      }

      else if (
        issue.status === 'In Progress' &&
        issue.inProgressAt
      ) {

        action = 'Issue moved to progress'

        activityTime =
          issue.inProgressAt

      }

      else if (
        issue.status === 'Approved' &&
        issue.approvedAt
      ) {

        action = 'Issue approved'

        activityTime =
          issue.approvedAt

      }


      return {

        id: issue.id,

        issueId:
          `CP-${issue.id}`,

        title:
          issue.title || 'Untitled issue',

        category:
          issue.category || 'Other',

        location:
          issue.location || 'Location not provided',

        action,

        admin:
          reporter
            ? reporter.name
            : 'Unknown user',

        time:
          activityTime
            ? new Date(
              activityTime
            ).toLocaleString()
            : 'Unknown time',

        status:
          issue.status || 'Pending'

      }

    })


  if (loading) {

    return (

      <AdminLayout>

        <div className="admin-loading">

          <FaSpinner
            className="admin-loading-icon"
          />

          <p>
            Loading dashboard data...
          </p>

        </div>

      </AdminLayout>

    )

  }

  return (

    <AdminLayout>

      <div className="admin-dashboard">

        {/*WELCOME SECTION*/}
        <section className="dashboard-welcome">

          <div>

            <span className="dashboard-eyebrow">

              ADMINISTRATOR OVERVIEW

            </span>


            <h1>
              Welcome back, {userName}!
            </h1>


            <p className="dashboard-subtitle">

              Here is what's happening across
              your community today.

            </p>

          </div>


          <div className="dashboard-date">

            <FaClock />

            <span>
              Community Operations
            </span>

          </div>

        </section>

        {/* overview cards */}
        <section className="admin-stats-grid">

          {stats.map((stat) => {

            const Icon = stat.icon

            return (

              <article
                className="admin-stat-card"
                key={stat.title}
              >

                <div
                  className={
                    `admin-stat-icon ${stat.color}`
                  }
                >

                  <Icon />

                </div>


                <div className="admin-stat-title">

                  {stat.title}

                </div>


                <div className="admin-stat-value fw-bold fs-4">

                  {stat.value}

                </div>


                <div className="admin-stat-change">

                  <FaArrowUp />

                  <span>
                    {stat.note}
                  </span>

                </div>

              </article>

            )

          })}

        </section>


        {/* charts */}
        <section className="admin-dashboard-grid">

          {/* CATEGORY BAR CHART */}
          <article className="admin-panel chart-panel">

            <div className="admin-panel-heading">

              <div>

                <h3>
                  Issues by Category
                </h3>

                <p>
                  Reports received across
                  different categories
                </p>

              </div>


              <div className="panel-icon">

                <FaClipboardList />

              </div>

            </div>


            <div className="admin-chart">

              <Bar
                data={barChartData}
                options={barChartOptions}
              />

            </div>

          </article>

          {/* STATUS PIE CHART */}
          <article className="admin-panel chart-panel">

            <div className="admin-panel-heading">

              <div>

                <h3>
                  Issues by Status
                </h3>

                <p>
                  Current distribution of
                  reported issues
                </p>

              </div>


              <div className="panel-icon">

                <FaCheckCircle />

              </div>

            </div>


            <div className="admin-pie-chart">

              <Pie
                data={pieChartData}
                options={pieChartOptions}
              />

            </div>

          </article>

        </section>

        {/* recent activity */}
        <section className="admin-panel recent-activity-panel">

          <div className="admin-panel-heading">

            <div>

              <h3>
                Recent Activity
              </h3>

              <p>
                Latest issue reports,
                community updates and
                status changes
              </p>

            </div>


            <div className="panel-icon">

              <FaClock />

            </div>

          </div>

          <div className="admin-table-wrapper">

            <table className="admin-issues-table recent-activity-table">

              <thead>

                <tr>

                  <th>
                    Issue
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    Activity
                  </th>

                  <th>
                    Reported By
                  </th>

                  <th>
                    Time
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentActivity.length > 0 ? (

                  recentActivity.map(
                    (activity) => (

                      <tr
                        key={activity.id}
                      >


                        {/* ISSUE */}

                        <td>

                          <div className="admin-issue-title">

                            <strong>
                              {activity.title}
                            </strong>

                            <span>
                              {activity.issueId}
                            </span>

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td>

                          {activity.category}

                        </td>


                        {/* LOCATION */}

                        <td>

                          <span className="admin-location">

                            <FaMapMarkerAlt />

                            {activity.location}

                          </span>

                        </td>

                        {/* ACTIVITY */}

                        <td>

                          {activity.action}

                        </td>

                        {/* REPORTED BY */}

                        <td>

                          {activity.admin}

                        </td>

                        {/* TIME */}

                        <td>

                          <span className="activity-time">

                            {activity.time}

                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          <StatusBadge status={activity.status} />

                        </td>


                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      style={{
                        textAlign: 'center',
                        padding: '30px'
                      }}
                    >

                      No recent activity found.

                    </td>

                  </tr>

                )}


              </tbody>


            </table>

          </div>


        </section>


      </div>

    </AdminLayout>

  )

}


export default AdminDashboard