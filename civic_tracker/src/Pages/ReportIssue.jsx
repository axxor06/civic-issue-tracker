import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addIssueAPI } from '../services/allAPI'
import { getLoggedUser } from '../utils/auth'

const CATEGORIES = [
  'Road',
  'Streetlight',
  'Waste',
  'Electricity',
  'Water',
  'Noise',
  'Other',
]

function ReportIssue() {
  const navigate = useNavigate()
  const user = getLoggedUser()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !category || !location.trim() || !description.trim()) {
      setError('Please fill in all the fields.')
      return
    }

    if (!user?.id) {
      toast.error('Please log in to report an issue.')
      navigate('/login')
      return
    }

    try {
      setLoading(true)

      await addIssueAPI({
        title: title.trim(),
        category,
        location: location.trim(),
        description: description.trim(),
        status: 'Pending',
        supporters: [],
        reportedBy: user.id,
        createdAt: new Date().toISOString(),
      })

      toast.success('Issue reported successfully!')
      navigate('/dashboard')
    } catch (err) {
      setError(
        'Unable to submit your report. Please check your connection and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="report-page">
      <div className="report-container">
        <Link to="/dashboard" className="report-back">
          <span aria-hidden="true">←</span> Back to issues
        </Link>

        <div className="report-heading ">
          <div className="report-icon" aria-hidden="true">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>

          <p className="report-eyebrow">CIVIC ISSUE TRACKER</p>
          <h1>Report an issue</h1>
          <p className="report-subtitle">
            Help make your community better. Tell us what needs attention.
          </p>
        </div>

        <form className="report-form" onSubmit={handleSubmit}>
          <div className="report-form-header">
            <h2>Issue details</h2>
            <p>Fields marked with * are required.</p>
          </div>

          <div className="report-field">
            <label htmlFor="title">
              Issue title <span>*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Pothole near the main bus stop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
              disabled={loading}
            />
            <small>Give your issue a short, clear title.</small>
          </div>

          <div className="report-field">
            <label htmlFor="category">
              Category <span>*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={loading}
            >
              <option value="" disabled>
                Select an issue category
              </option>

              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="report-field">
            <label htmlFor="location">
              Location <span>*</span>
            </label>
            <input
              id="location"
              type="text"
              placeholder="e.g. Near the main bus stop, Palakkad"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={200}
              required
              disabled={loading}
            />
            <small>Include the area, street, or a nearby landmark.</small>
          </div>

          <div className="report-field">
            <div className="report-label-row">
              <label htmlFor="description">
                Description <span>*</span>
              </label>
              <small>{description.length}/2000</small>
            </div>

            <textarea
              id="description"
              rows={5}
              placeholder="Describe the problem, its impact, and any important details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <p className="report-error" role="alert">
              {error}
            </p>
          )}

          <div className="report-actions">
            <button
              type="submit"
              className="report-submit"
              disabled={loading}
            >
              {loading ? 'Submitting report...' : 'Submit report'}
              {!loading && <span aria-hidden="true"> →</span>}
            </button>

            <Link
              to="/dashboard"
              className={`report-cancel ${loading ? 'report-cancel-disabled' : ''}`}
              onClick={(e) => {
                if (loading) e.preventDefault()
              }}
              aria-disabled={loading}
            >
              Cancel
            </Link>
          </div>

          <p className="report-footer-note">
            Your report can help improve your local community.
          </p>
        </form>
      </div>
    </section>
  )
}

export default ReportIssue