import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ProtectedRoute() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession)
      })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <p>Checking login...</p>

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
