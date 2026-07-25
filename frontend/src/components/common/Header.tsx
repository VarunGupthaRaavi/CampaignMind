import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Bell, LogOut, Settings, User as UserIcon, Menu, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  title: string
  onMobileMenuToggle?: () => void
}

export function Header({ title, onMobileMenuToggle }: HeaderProps) {
  const { user, dbUser, signOut } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    setDropdownOpen(false)
    await signOut()
    navigate('/login')
  }

  const displayName = dbUser?.full_name || user?.user_metadata?.full_name || 'Marketing Lead'
  const displayEmail = dbUser?.email || user?.email || 'user@campaignmind.ai'
  const initials = displayName.split(' ').map((n: any[]) => n[0]).join('').slice(0, 2) || 'U'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 px-4 sm:px-8 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Hamburger Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground hover:text-white"
          onClick={onMobileMenuToggle}
          title="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications Button */}
        <Button variant="outline" size="icon" className="relative rounded-full border-white/10 bg-card/50">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-purple-500 ring-2 ring-background animate-pulse" />
        </Button>

        {/* User Profile Dropdown Menu */}
        <DropdownMenu>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-full p-0.5 focus:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Avatar fallback={initials} className="h-9 w-9" />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-white leading-none">{displayName}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[140px] truncate">{displayEmail}</p>
            </div>
          </button>

          {dropdownOpen && (
            <DropdownMenuContent className="w-56 mt-2">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                <p className="text-[11px] text-muted-foreground truncate">{displayEmail}</p>
              </div>

              <DropdownMenuItem onClick={() => { setDropdownOpen(false); navigate('/settings'); }}>
                <Settings className="h-4 w-4 mr-2 text-purple-400" /> Workspace Settings
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => { setDropdownOpen(false); navigate('/campaigns/new'); }}>
                <Sparkles className="h-4 w-4 mr-2 text-indigo-400" /> Create Campaign
              </DropdownMenuItem>

              <div className="border-t border-white/10 my-1" />

              <DropdownMenuItem onClick={handleSignOut} className="text-red-400 hover:bg-red-500/10">
                <LogOut className="h-4 w-4 mr-2 text-red-400" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </header>
  )
}
