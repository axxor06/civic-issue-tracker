import { useEffect, useMemo, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { toast } from 'react-toastify'
import IssueFilters from '../Components/IssueFilters'
import IssueItem from '../Components/IssueItem'
import { fetchIssues } from '../Redux/slice/issueSlice'
import { deleteIssueAPI, updateIssueAPI } from '../services/allAPI'
import { getLoggedUser } from '../utils/auth'
import { statusOf } from '../utils/issueHelpers'

function Dashboard() {
  const dispatch = useDispatch()
  const user = getLoggedUser()
  const { allIssues, loading, error } = useSelector((state) => state.issueReducer)

  const [searchKey, setSearchKey] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    dispatch(fetchIssues())
  }, [dispatch])

  // priority number only for issues that are still open
  const rankOf = useMemo(
    () =>
      new Map(
        allIssues
          .filter((i) => statusOf(i) !== 'Resolved')
          .map((i, index) => [i.id, index + 1])
      ),
    [allIssues]
  )

  const shown = useMemo(
    () =>
      allIssues.filter(
        (i) =>
          (filter === 'All' || statusOf(i) === filter) &&
          [i.title, i.category, i.location]
            .join(' ')
            .toLowerCase()
            .includes(searchKey.toLowerCase())
      ),
    [allIssues, filter, searchKey]
  )

  const count = (status) => allIssues.filter((i) => statusOf(i) === status).length

  const handleSupport = async (issue) => {
    const supporters = issue.supporters || []
    const supported = supporters.some((id) => String(id) === String(user.id))

    try {
      await updateIssueAPI(issue.id, {
        supporters: supported
          ? supporters.filter((id) => String(id) !== String(user.id))
          : [...supporters, user.id],
      })
      dispatch(fetchIssues())
    } catch {
      toast.error('Could not update support. Please try again.')
    }
  }

  const handleDelete = async (issue) => {
    if (!window.confirm('Delete this issue?')) return

    try {
      await deleteIssueAPI(issue.id)
      toast.success('Issue deleted')
      dispatch(fetchIssues())
    } catch {
      toast.error('Could not delete the issue.')
    }
  }

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Community issues</h1>
          <p className="stats">
            {allIssues.length} reported · {count('Pending')} pending ·{' '}
            {count('In Progress')} in progress · {count('Resolved')} resolved
          </p>
        </div>
        <Link to="/report-issue" className="btn-main">Report an issue</Link>
      </div>

      <IssueFilters
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        filter={filter}
        setFilter={setFilter}
      />

      {loading && allIssues.length === 0 ? (
        <div className="empty"><Spinner animation="border" size="sm" /></div>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : shown.length === 0 ? (
        <p className="empty">
          {allIssues.length === 0
            ? 'Nothing has been reported yet. Be the first.'
            : 'No issues match your search.'}
        </p>
      ) : (
        <div className="issue-list">
          {shown.map((issue) => {
            const supported = (issue.supporters || []).some(
              (id) => String(id) === String(user.id)
            )
            const resolved = statusOf(issue) === 'Resolved'
            const canDelete =
              user.role === 'admin' || String(issue.reportedBy) === String(user.id)

            return (
              <IssueItem key={issue.id} issue={issue} rank={rankOf.get(issue.id)}>
                <button
                  type="button"
                  className={`support ${supported ? 'on' : ''}`}
                  disabled={resolved}
                  onClick={() => handleSupport(issue)}
                >
                  {supported ? <FaHeart /> : <FaRegHeart />}
                  {supported ? 'Supported' : 'Support'} · {issue.supporters?.length || 0}
                </button>

                {canDelete && (
                  <button type="button" className="link-danger" onClick={() => handleDelete(issue)}>
                    Delete
                  </button>
                )}
              </IssueItem>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Dashboard
