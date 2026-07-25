import * as React from "react"
import { cn } from "@/lib/utils"

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-block text-left">{children}</div>
}

export function DropdownMenuContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-card p-1 text-card-foreground shadow-2xl backdrop-blur-md z-50",
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-purple-500/10 hover:text-white transition-colors",
        className
      )}
    >
      {children}
    </button>
  )
}
