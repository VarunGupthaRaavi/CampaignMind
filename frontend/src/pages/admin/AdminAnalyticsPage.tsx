import { useQuery } from '@tanstack/react-query'
import { BarChart2, PieChart, TrendingUp, Target, Building } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'
import { APIResponse } from '@/types/api'

interface AnalyticsData {
  popular_industries: Array<{ industry: string; count: number }>
  popular_goals: Array<{ goal: string; count: number }>
}

export function AdminAnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await apiClient<APIResponse<AnalyticsData>>('/admin/analytics')
      return res.data
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  const industries = analytics?.popular_industries || []
  const goals = analytics?.popular_goals || []
  const maxIndustryCount = Math.max(...industries.map((i) => i.count), 1)
  const maxGoalCount = Math.max(...goals.map((g) => g.count), 1)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart2 className="h-7 w-7 text-purple-400" /> Platform Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Industry distribution and popular marketing objectives.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Popular Industries */}
        <Card className="glass-panel rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Building className="h-5 w-5 text-indigo-400" /> Popular Industries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {industries.length === 0 ? (
              <p className="text-muted-foreground">No industry data recorded yet.</p>
            ) : (
              industries.map((ind, i) => {
                const pct = Math.round((ind.count / maxIndustryCount) * 100)
                return (
                  <div key={i} className="space-y-1.5 p-3 rounded-xl bg-secondary/40 border border-white/5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">{ind.industry}</span>
                      <span className="text-purple-300">{ind.count} campaigns ({pct}%)</span>
                    </div>
                    <Progress value={pct} max={100} className="h-2" />
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Popular Goals */}
        <Card className="glass-panel rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-400" /> Popular Campaign Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {goals.length === 0 ? (
              <p className="text-muted-foreground">No goal data recorded yet.</p>
            ) : (
              goals.map((g, i) => {
                const pct = Math.round((g.count / maxGoalCount) * 100)
                return (
                  <div key={i} className="space-y-1.5 p-3 rounded-xl bg-secondary/40 border border-white/5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">{g.goal}</span>
                      <span className="text-emerald-400">{g.count} campaigns ({pct}%)</span>
                    </div>
                    <Progress value={pct} max={100} className="h-2" />
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
