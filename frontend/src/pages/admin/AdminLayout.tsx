import { Outlet, NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, Users, Megaphone, BarChart2, Sparkles, ArrowLeft, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function AdminLayout() {
  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/campaigns', label: 'Campaigns', icon: Megaphone },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/10 bg-card/60 backdrop-blur-xl flex flex-col justify-between shrink-0 p-6 space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-lg shadow-purple-500/30">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Admin<span className="gradient-text">Suite</span></span>
            </Link>
            <Badge variant="success" className="text-[10px]">Admin</Badge>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-purple-500/20 text-white border border-purple-500/30 shadow-md shadow-purple-500/10'
                        : 'text-muted-foreground hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/5">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to User App
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
