import { supabase } from '../lib/supabase'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
const navigate = useNavigate()
async function handleLogin(event) {
  event.preventDefault()

  const form = event.currentTarget
  const email = form.elements.email.value
  const password = form.elements.password.value

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    alert('Login failed: ' + error.message)
    return
  }
navigate('/admin/dashboard', { replace: true })
}
  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">AURA</div>

        <h1>Admin Login</h1>
        <p>Sign in to manage your store.</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="admin-email">Email address</label>
          <input
            id="admin-email"
            type="email"
            name="email"
            autoComplete="username"
            required
          />

          <label htmlFor="admin-password">Password</label>
          <div className="admin-password-field">
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
<button type="submit">
  Login
</button>
        </form>

        <Link to="/">← Back to Aura Perfumes</Link>
      </div>
    </main>
  )
}

export default AdminLogin
