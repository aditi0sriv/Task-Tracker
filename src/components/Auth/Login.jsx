import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './styles/Login.css'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { email, password } = formData

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const res = await fetch('https://task-tracker-backend-plum.vercel.app/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Login failed.')
      }

      localStorage.setItem('token', data.token)

      // Redirect to landing page
      navigate('/Landing')

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} noValidate>
        <h1>Task Tracker</h1>
        <h2>Login</h2>

        <div className="credentials">
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p>
          Don't have an account? 
          <Link 
            className='link'
            to="/signup"
          >Sign up</Link>
        </p>
      </form>
    </div>
  )
}