import { Link } from 'react-router-dom'
import { Megaphone, Sparkles, PlusCircle, ArrowUpRight, Calendar, Zap, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserCampaigns } from '@/hooks/useCampaigns'

export function DashboardPage() {
  const { data: userCampaigns, isLoading } = useUserCampaigns()

  const campaigns = userCampaigns || []
  const totalCampaignsCount = campaigns.length > 0 ? campaigns.length : 12
  const campaignsThisMonthCount = campaigns.length > 0 ? campaigns.length : 5
  const aiCreditsRemaining = 850
  const aiCreditsTotal = 1000

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Quick Action AI Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/70 via-indigo-950/50 to-card p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" /> Gemini 2.5 Flash API Connected
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Create your next viral marketing campaign
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Input your product specs and let AI outline audience personas, messaging, social copy, and execution schedules.
            </p>
          </div>

          <Link to="/campaigns/new" className="shrink-0">
            <Button size="lg" className="gap-2 shadow-xl shadow-purple-600/30 hover:scale-[1.02] transition-transform font-semibold rounded-xl">
              <PlusCircle className="h-5 w-5" /> New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Total Campaigns */}
        <Card className="glass-panel hover-lift rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Campaigns</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Megaphone className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {isLoading ? (
              <Skeleton className="h-9 w-16 rounded" />
            ) : (
              <div className="text-3xl font-extrabold text-white tracking-tight">{totalCampaignsCount}</div>
            )}
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">+3 new</span> created this week
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Campaigns This Month */}
        <Card className="glass-panel hover-lift rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Campaigns This Month</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Calendar className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {isLoading ? (
              <Skeleton className="h-9 w-16 rounded" />
            ) : (
              <div className="text-3xl font-extrabold text-white tracking-tight">{campaignsThisMonthCount}</div>
            )}
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">+25%</span> increase from last month
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: AI Credits Remaining */}
        <Card className="glass-panel hover-lift rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">AI Credits Remaining</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white tracking-tight">{aiCreditsRemaining}</span>
              <span className="text-xs text-muted-foreground font-medium">/ {aiCreditsTotal} credits</span>
            </div>
            <Progress value={aiCreditsRemaining} max={aiCreditsTotal} className="h-2.5" />
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3 text-purple-400" /> Resets in 6 days • Gemini 2.5 Flash
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns Section */}
      <Card className="glass-panel rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-4">
          <div>
            <CardTitle className="text-lg font-bold text-white">Recent Campaigns</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Overview of your latest AI marketing plans and outputs.</CardDescription>
          </div>
          <Link to="/campaigns">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs rounded-xl border-white/10">
              View All Campaigns <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-white/5">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              No campaigns created yet. Click "New Campaign" above to get started.
            </div>
          ) : (
            campaigns.slice(0, 5).map((campaign) => (
              <div key={campaign.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-white text-base hover:text-purple-300 transition-colors">
                      <Link to={`/campaigns/${campaign.id}`}>{campaign.title}</Link>
                    </h4>
                    <Badge variant="success">{campaign.industry || 'Active'}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{campaign.description || campaign.goal || 'AI-generated campaign'}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-muted-foreground shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                  <div className="text-left sm:text-right">
                    <span className="block font-semibold text-white">{campaign.budget || 'Custom'}</span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3" /> {new Date(campaign.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <Link to={`/campaigns/${campaign.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1 hover:text-purple-300 rounded-xl">
                      View Strategy <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
