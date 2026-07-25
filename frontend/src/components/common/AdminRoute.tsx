import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function AdminRoute() {
  const { user, dbUser, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner label="Verifying administrator privileges..." />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (dbUser?.role !== 'admin') {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
