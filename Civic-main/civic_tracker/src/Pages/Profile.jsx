import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getAllUsersAPI, getUserAPI, updateUserAPI } from '../services/allAPI'
import { getLoggedUser, saveLoggedUser } from '../utils/auth'

function Profile() {
  const loggedUser = getLoggedUser()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getUserAPI(loggedUser.id)
        setName(response.data.name || '')
        setEmail(response.data.email || '')
        setRole(response.data.role || 'user')
      } catch {
        setError('Unable to load your profile.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [loggedUser.id])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.')
      return
    }

    try {
      setSaving(true)

      const users = await getAllUsersAPI()
      const taken = users.data.some(
        (u) =>
          String(u.id) !== String(loggedUser.id) &&
          u.email.toLowerCase() === email.trim().toLowerCase()
      )

      if (taken) {
        setError('This email is already registered.')
        return
      }

      const response = await updateUserAPI(loggedUser.id, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      })

      saveLoggedUser({ ...loggedUser, ...response.data })
      setName(response.data.name)
      setEmail(response.data.email)
      setEditing(false)
      toast.success('Profile updated')
    } catch {
      setError('Unable to update profile. Check your json-server connection.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="page page-narrow">
      <h1 className="page-title">Your profile</h1>

      {loading ? (
        <div className="empty"><Spinner animation="border" size="sm" /></div>
      ) : editing ? (
        <form onSubmit={handleUpdate} className="form">
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-main" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              className="link-quiet"
              onClick={() => {
                setName(loggedUser.name || '')
                setEmail(loggedUser.email || '')
                setEditing(false)
                setError('')
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {error && <p className="form-error">{error}</p>}

          <dl className="profile-list">
            <div><dt>Name</dt><dd>{name}</dd></div>
            <div><dt>Email</dt><dd>{email}</dd></div>
            <div><dt>Role</dt><dd style={{ textTransform: 'capitalize' }}>{role}</dd></div>
          </dl>

          <button type="button" className="btn-ghost" onClick={() => setEditing(true)}>
            Edit profile
          </button>
        </>
      )}
    </section>
  )
}

export default Profile
