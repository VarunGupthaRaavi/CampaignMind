import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from '@/context/QueryProvider'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/components/ui/toast'
import { AppRoutes } from '@/routes/AppRoutes'

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
