import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addIssueAPI } from '../services/allAPI'
import { getLoggedUser } from '../utils/auth'

const SUGGESTIONS = ['Road damage', 'Streetlight', 'Water supply', 'Drainage', 'Garbage', 'Electricity']

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

    if (!title.trim() || !category.trim() || !location.trim() || !description.trim()) {
      setError('Please fill in all the fields.')
      return
    }

    try {
      setLoading(true)
      await addIssueAPI({
        title: title.trim(),
        category: category.trim(),
        location: location.trim(),
        description: description.trim(),
        status: 'Pending',
        supporters: [],
        reportedBy: user.id,
        createdAt: new Date().toISOString(),
      })

      toast.success('Issue reported. Thank you!')
      navigate('/dashboard')
    } catch {
      setError('Unable to submit. Make sure json-server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page page-narrow">
      <Link to="/dashboard" className="link-quiet back">← Back to issues</Link>

      <h1 className="page-title">Report an issue</h1>
      <p className="page-sub">What needs attention, and where?</p>

      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Fallen tree blocking the road"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            list="categories"
            placeholder="Pick one or type your own"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            maxLength={100}
            required
          />
          <datalist id="categories">
            {SUGGESTIONS.map((s) => <option key={s} value={s} />)}
          </datalist>
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            placeholder="e.g. Near the main bus stop, Palakkad"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={200}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={5}
            placeholder="What's the problem and who does it affect?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            required
          />
          <small>{description.length}/2000</small>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-main" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit report'}
          </button>
          <Link to="/dashboard" className="link-quiet">Cancel</Link>
        </div>
      </form>
    </section>
  )
}

export default ReportIssue
