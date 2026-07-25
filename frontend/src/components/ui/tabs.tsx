import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  defaultValue: string
  children: React.ReactNode
  className?: string
}

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue)

  return (
    <div className={cn("space-y-4", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            activeTab,
            setActiveTab,
          })
        }
        return child
      })}
    </div>
  )
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("inline-flex h-11 items-center justify-center rounded-lg bg-secondary/50 p-1 text-muted-foreground border border-white/5", className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, activeTab, setActiveTab, children }: { value: string; activeTab?: string; setActiveTab?: (v: string) => void; children: React.ReactNode }) {
  const isActive = activeTab === value
  return (
    <button
      onClick={() => setActiveTab?.(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-primary text-white shadow-sm" : "hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, activeTab, children }: { value: string; activeTab?: string; children: React.ReactNode }) {
  if (activeTab !== value) return null
  return <div className="mt-2">{children}</div>
}
