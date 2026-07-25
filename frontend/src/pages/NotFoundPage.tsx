import { Link } from 'react-router-dom'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6 shadow-xl shadow-purple-500/10">
        <FileQuestion className="h-10 w-10" />
      </div>

      <h1 className="text-8xl font-black gradient-text tracking-tighter">404</h1>
      <h2 className="text-2xl font-bold text-white mt-4">Page Not Found</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
        The route you are looking for does not exist, has been moved, or is temporarily unavailable.
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
