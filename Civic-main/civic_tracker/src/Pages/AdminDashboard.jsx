import { useEffect, useMemo, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import IssueFilters from '../Components/IssueFilters'
import IssueItem from '../Components/IssueItem'
import { fetchIssues } from '../Redux/slice/issueSlice'
import { deleteIssueAPI, updateIssueAPI } from '../services/allAPI'
import { getLoggedUser } from '../utils/auth'
import { STATUSES, statusOf } from '../utils/issueHelpers'

function AdminDashboard() {
  const dispatch = useDispatch()
  const admin = getLoggedUser()
  const { allIssues, loading, error } = useSelector((state) => state.issueReducer)

  const [searchKey, setSearchKey] = useState('')
  const [filter, setFilter] = useState('All')
  const [openId, setOpenId] = useState(null) // issue whose reply box is open
  const [drafts, setDrafts] = useState({})
  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    dispatch(fetchIssues())
  }, [dispatch])

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

  const handleStatusChange = async (issue, status) => {
    try {
      await updateIssueAPI(issue.id, { status })
      toast.success('Status updated')
      dispatch(fetchIssues())
    } catch {
      toast.error('Failed to update status')
    }
  }

  const toggleReply = (issue) => {
    if (openId === issue.id) {
      setOpenId(null)
      return
    }
    setDrafts({ ...drafts, [issue.id]: drafts[issue.id] ?? issue.adminResponse ?? '' })
    setOpenId(issue.id)
  }

  const handleSaveResponse = async (issue) => {
    const adminResponse = (drafts[issue.id] || '').trim()

    if (!adminResponse) {
      toast.error('Write a response first')
      return
    }

    try {
      setSavingId(issue.id)
      await updateIssueAPI(issue.id, { adminResponse })
      toast.success('Response saved')
      setOpenId(null)
      dispatch(fetchIssues())
    } catch {
      toast.error('Failed to save response')
    } finally {
      setSavingId(null)
    }
  }

  const handleDelete = async (issue) => {
    if (!window.confirm('Delete this issue?')) return

    try {
      await deleteIssueAPI(issue.id)
      toast.success('Issue deleted')
      dispatch(fetchIssues())
    } catch {
      toast.error('Failed to delete issue')
    }
  }

  return (
    <section className="page">
      <h1 className="page-title">Manage issues</h1>
      <p className="stats">
        Hello, {admin.name}. {allIssues.length} total · {count('Pending')} pending ·{' '}
        {count('In Progress')} in progress · {count('Resolved')} resolved
      </p>

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
        <p className="empty">No issues to show.</p>
      ) : (
        <div className="issue-list">
          {shown.map((issue) => (
            <IssueItem key={issue.id} issue={issue}>
              <label className="inline-select">
                Status
                <select
                  value={statusOf(issue)}
                  onChange={(e) => handleStatusChange(issue, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>

              <span className="supporters">{issue.supporters?.length || 0} supporting</span>

              <button type="button" className="link-quiet" onClick={() => toggleReply(issue)}>
                {openId === issue.id ? 'Close' : issue.adminResponse ? 'Edit response' : 'Respond'}
              </button>

              <button type="button" className="link-danger" onClick={() => handleDelete(issue)}>
                Delete
              </button>

              {openId === issue.id && (
                <div className="reply-box">
                  <textarea
                    rows={3}
                    placeholder="Write an update for the community…"
                    value={drafts[issue.id] || ''}
                    onChange={(e) => setDrafts({ ...drafts, [issue.id]: e.target.value })}
                  />
                  <button
                    type="button"
                    className="btn-main"
                    disabled={savingId === issue.id}
                    onClick={() => handleSaveResponse(issue)}
                  >
                    {savingId === issue.id ? 'Saving…' : 'Save response'}
                  </button>
                </div>
              )}
            </IssueItem>
          ))}
        </div>
      )}
    </section>
  )
}

export default AdminDashboard
