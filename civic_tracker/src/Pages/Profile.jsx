import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import {
  getAllUsersAPI,
  getUserAPI,
  updateUserAPI,
} from '../services/allAPI'
import { getLoggedUser, saveLoggedUser } from '../utils/auth'

function Profile() {
  const loggedUser = getLoggedUser()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
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
          u.email?.toLowerCase() === email.trim().toLowerCase()
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

      setName(response.data.name || '')
      setEmail(response.data.email || '')
      setEditing(false)

      toast.success('Profile updated successfully!')
    } catch {
      setError('Unable to update profile. Check your json-server connection.')
    } finally {
      setSaving(false)
    }
  }

  const cancelEdit = () => {
    setName(loggedUser.name || name)
    setEmail(loggedUser.email || email)
    setEditing(false)
    setError('')
  }

  if (loading) {
    return (
      <section className="profile-page">
        <div className="profile-loading">
          <Spinner animation="border" />
          <p>Preparing your profile...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="profile-page">
      <div className="profile-decoration profile-decoration-one" />
      <div className="profile-decoration profile-decoration-two" />

      <div className="profile-container">
        <div className="profile-heading">
          <span className="profile-eyebrow">
            <span className="profile-eyebrow-dot" />
            CIVIC ISSUE TRACKER
          </span>

          <h1>My Profile</h1>
          <p>Your personal space to manage your account information.</p>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {name.trim().charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="profile-avatar-status" />
            </div>

            <div className="profile-user-heading">
              <span className="profile-welcome">WELCOME BACK</span>
              <h2>{name || 'User'}</h2>
              <p>{email}</p>
              <span className="profile-account-badge">
                <span className="profile-account-dot" />
                Active account
              </span>
            </div>

            {!editing && (
              <button
                type="button"
                className="profile-header-edit"
                onClick={() => {
                  setEditing(true)
                  setError('')
                }}
                aria-label="Edit profile"
                title="Edit profile"
              >
                ✎
              </button>
            )}
          </div>

          <div className="profile-card-body">
            {error && (
              <div className="profile-error" role="alert">
                <span>!</span>
                {error}
              </div>
            )}

            {editing ? (
              <form onSubmit={handleUpdate} className="profile-form">
                <div className="profile-section-heading">
                  <div>
                    <h3>Edit your information</h3>
                    <p>Update your name and email address below.</p>
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-name">Full name</label>
                  <div className="profile-input-wrapper">
                    <span className="profile-input-icon">♙</span>
                    <input
                      id="profile-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-email">Email address</label>
                  <div className="profile-input-wrapper">
                    <span className="profile-input-icon">✉</span>
                    <input
                      id="profile-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="profile-actions">
                  <button
                    type="submit"
                    className="profile-btn profile-btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : '✓ Save Changes'}
                  </button>

                  <button
                    type="button"
                    className="profile-btn profile-btn-secondary"
                    onClick={cancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="profile-section-heading">
                  <div>
                    <h3>Personal Information</h3>
                    <p>Your registered account details.</p>
                  </div>
                  <span className="profile-lock-icon">✓</span>
                </div>

                <div className="profile-details">
                  <div className="profile-detail-item">
                    <div className="profile-detail-icon profile-name-icon">
                      ♙
                    </div>
                    <div className="profile-detail-content">
                      <span className="profile-detail-label">Full name</span>
                      <p>{name || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="profile-detail-item">
                    <div className="profile-detail-icon profile-email-icon">
                      ✉
                    </div>
                    <div className="profile-detail-content">
                      <span className="profile-detail-label">
                        Email address
                      </span>
                      <p>{email || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="profile-actions">
                  <button
                    type="button"
                    className="profile-btn profile-btn-primary"
                    onClick={() => {
                      setEditing(true)
                      setError('')
                    }}
                  >
                    <span className="profile-edit-symbol">✎</span>
                    Edit Profile
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="profile-card-footer">
            <div className="profile-footer-icon">✓</div>
            <div>
              <strong>Your information, your control</strong>
              <p>Keep your account details accurate and up to date.</p>
            </div>
          </div>
        </div>

        <p className="profile-bottom-text">
          Together, we can build a better community. 💚
        </p>
      </div>
    </section>
  )
}

export default Profile