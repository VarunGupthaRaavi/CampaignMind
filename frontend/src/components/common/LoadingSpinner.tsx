import { Loader2 } from 'lucide-react'

export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  )
}
