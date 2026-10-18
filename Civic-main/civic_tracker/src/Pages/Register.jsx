import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAllUsersAPI, registerUserAPI } from '../services/allAPI'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)
      const response = await getAllUsersAPI()

      const exists = response.data.some(
        (user) => user.email.toLowerCase() === email.trim().toLowerCase()
      )

      if (exists) {
        setError('An account with this email already exists.')
        return
      }

      await registerUserAPI({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: 'user',
      })

      toast.success('Account created. Please log in.')
      navigate('/login')
    } catch {
      setError('Unable to register. Make sure json-server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page page-narrow">
      <h1 className="page-title">Create an account</h1>
      <p className="page-sub">Join in and help improve your community.</p>

      <form onSubmit={handleRegister} className="form">
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          <small>At least 6 characters.</small>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button type="submit" className="btn-main" disabled={loading}>
          {loading ? 'Creating…' : 'Sign up'}
        </button>
      </form>

      <p className="form-foot">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </section>
  )
}

export default Register
