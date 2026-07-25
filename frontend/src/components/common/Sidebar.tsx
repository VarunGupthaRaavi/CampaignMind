import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Megaphone, PlusCircle, Settings, Sparkles, LogOut, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useUserCampaigns } from '@/hooks/useCampaigns'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Campaigns', path: '/campaigns', icon: Megaphone },
  { label: 'New Campaign', path: '/campaigns/new', icon: PlusCircle },
  { label: 'Settings', path: '/settings', icon: Settings },
]

interface SidebarProps {
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const { user, dbUser, signOut } = useAuth()
  const { data: userCampaigns } = useUserCampaigns()
  const navigate = useNavigate()

  const campaignCount = (userCampaigns || []).length

  const handleSignOut = async () => {
    onCloseMobile?.()
    await signOut()
    navigate('/login')
  }

  const displayName = dbUser?.full_name || user?.user_metadata?.full_name || 'Marketing Lead'
  const displayEmail = dbUser?.email || user?.email || 'user@campaignmind.ai'
  const initials = displayName.split(' ').map((n: any[]) => n[0]).join('').slice(0, 2) || 'U'

  const sidebarContent = (
    <aside className="w-64 border-r border-white/10 bg-card/60 backdrop-blur-2xl flex flex-col h-full sticky top-0 shadow-2xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <NavLink to="/dashboard" onClick={onCloseMobile} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-md shadow-purple-500/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white">Campaign<span className="gradient-text">Mind</span></span>
        </NavLink>

        {onCloseMobile && (
          <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground" onClick={onCloseMobile}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Main Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* Campaign Credit Widget in Sidebar */}
      <div className="mx-4 mb-2 p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-purple-300 font-semibold flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-400" /> Free Plan
          </span>
          <span className="text-white font-bold">{campaignCount} / 1 Used</span>
        </div>
        <Progress value={Math.min(100, campaignCount * 100)} max={100} className="h-1.5" />
      </div>

      {/* Footer User Info & Sign Out */}
      <div className="p-4 border-t border-white/10 space-y-3 bg-background/30">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Avatar fallback={initials} className="h-8 w-8" />
            <div className="text-xs truncate">
              <p className="font-semibold text-white truncate leading-tight">{displayName}</p>
              <p className="text-muted-foreground truncate text-[11px] mt-0.5">{displayEmail}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="text-muted-foreground hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop Static Sidebar */}
      <div className="hidden md:block h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative z-10 h-full w-64">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
