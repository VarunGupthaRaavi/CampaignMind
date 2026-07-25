import { Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 text-red-400 border border-red-500/20 mb-6 shadow-xl shadow-red-500/10">
        <ShieldAlert className="h-10 w-10" />
      </div>

      <h1 className="text-4xl font-extrabold text-white tracking-tight">403 - Access Forbidden</h1>
      <p className="mt-3 text-sm text-muted-foreground max-w-md leading-relaxed">
        You do not have administrator permissions to access this area. If you believe this is an error, please contact system administration.
      </p>

      <div className="mt-8 flex gap-4">
        <Link to="/dashboard">
          <Button size="lg" className="gap-2 shadow-xl shadow-purple-600/25">
            <ArrowLeft className="h-4 w-4" /> Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
