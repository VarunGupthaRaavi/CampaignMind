import { useQuery } from '@tanstack/react-query'
import { Users, Megaphone, Calendar, Zap, Activity, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'
import { APIResponse } from '@/types/api'

interface AdminStats {
  total_users: number
  total_campaigns: number
  todays_campaigns: number
  total_ai_requests: number
  recent_activity: Array<{ id: string; type: string; title: string; created_at: string }>
}

export function AdminDashboardPage() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await apiClient<APIResponse<AdminStats>>('/admin/stats')
      return res.data
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    )
  }

  const stats = statsData || {
    total_users: 0,
    total_campaigns: 0,
    todays_campaigns: 0,
    total_ai_requests: 0,
    recent_activity: [],
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform metric summary and live activity log.</p>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-panel hover-lift rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Total Users</CardTitle>
            <Users className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-extrabold text-white">{stats.total_users}</div>
          </CardContent>
        </Card>

        <Card className="glass-panel hover-lift rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Total Campaigns</CardTitle>
            <Megaphone className="h-5 w-5 text-indigo-400" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-extrabold text-white">{stats.total_campaigns}</div>
          </CardContent>
        </Card>

        <Card className="glass-panel hover-lift rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Today's Campaigns</CardTitle>
            <Calendar className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-extrabold text-white">{stats.todays_campaigns}</div>
          </CardContent>
        </Card>

        <Card className="glass-panel hover-lift rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">AI Requests</CardTitle>
            <Zap className="h-5 w-5 text-amber-400" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-extrabold text-white">{stats.total_ai_requests}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Log */}
      <Card className="glass-panel rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" /> Recent System Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-white/5 text-xs">
          {stats.recent_activity.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">No recent activity.</div>
          ) : (
            stats.recent_activity.map((act) => (
              <div key={act.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                <div className="space-y-1">
                  <span className="font-bold text-white">{act.title}</span>
                  <p className="text-muted-foreground text-[11px]">Type: {act.type}</p>
                </div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {new Date(act.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
