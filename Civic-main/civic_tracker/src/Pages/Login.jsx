import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { getAllUsersAPI } from '../services/allAPI'
import { saveLoggedUser } from '../utils/auth'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const response = await getAllUsersAPI()

      const user = response.data.find(
        (item) =>
          item.email.toLowerCase() === email.trim().toLowerCase() &&
          item.password === password
      )

      if (!user) {
        toast.error('Invalid email or password')
        return
      }

      saveLoggedUser(user)
      toast.success(`Welcome back, ${user.name}`)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch {
      toast.error('Unable to log in. Make sure json-server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page page-narrow">
      <h1 className="page-title">Log in</h1>
      <p className="page-sub">Good to see you again.</p>

      <form onSubmit={handleLogin} className="form">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="input-with-btn">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-main" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="form-foot">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </section>
  )
}

export default Login
