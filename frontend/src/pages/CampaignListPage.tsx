import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Search, Trash2, Calendar, ArrowUpRight, Megaphone, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { useUserCampaigns, useDeleteCampaign } from '@/hooks/useCampaigns'

export function CampaignListPage() {
  const { data: campaigns, isLoading, error } = useUserCampaigns()
  const deleteCampaignMutation = useDeleteCampaign()
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete campaign "${title}"?`)) {
      try {
        await deleteCampaignMutation.mutateAsync(id)
        toast('Campaign Deleted', `"${title}" has been permanently removed.`, 'info')
      } catch (err: any) {
        toast('Delete Failed', err?.message || 'Could not delete campaign.', 'error')
      }
    }
  }

  const filteredCampaigns = (campaigns || []).filter((c) => {
    const term = searchTerm.toLowerCase()
    return (
      c.title.toLowerCase().includes(term) ||
      (c.description && c.description.toLowerCase().includes(term)) ||
      (c.industry && c.industry.toLowerCase().includes(term))
    )
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Megaphone className="h-7 w-7 text-purple-400" /> Campaign History
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your AI-generated marketing plans and ad creatives.
          </p>
        </div>

        <Link to="/campaigns/new">
          <Button size="lg" className="gap-2 shadow-xl shadow-purple-600/30 hover:scale-[1.02] transition-transform font-semibold">
            <PlusCircle className="h-5 w-5" /> New Campaign
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns by title, goal, or industry..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 bg-card/60 border-white/10 text-sm focus:border-purple-500/50"
        />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
          Failed to load campaign history from Supabase. Please check your network connection.
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Card key={n} className="glass-panel space-y-4 p-6">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              <Skeleton className="h-6 w-3/4 rounded" />
              <Skeleton className="h-12 w-full rounded" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredCampaigns.length === 0 ? (
        /* Empty State View */
        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-card/30 space-y-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-purple-600/20 to-indigo-500/20 text-purple-400 mx-auto border border-purple-500/30 shadow-xl shadow-purple-500/10">
            <Sparkles className="h-8 w-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-white">No campaigns found</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {searchTerm
                ? 'No campaigns match your search criteria. Try a different keyword.'
                : 'Start by generating your first AI-assisted marketing campaign using Gemini 2.5 Flash.'}
            </p>
          </div>
          {!searchTerm && (
            <Link to="/campaigns/new" className="inline-block pt-2">
              <Button size="lg" className="gap-2 shadow-xl shadow-purple-600/25">
                <PlusCircle className="h-5 w-5" /> Create First Campaign
              </Button>
            </Link>
          )}
        </div>
      ) : (
        /* Campaign Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((c) => (
            <Card key={c.id} className="glass-panel hover-lift rounded-2xl flex flex-col justify-between overflow-hidden">
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="success" className="px-3 py-1">
                    {c.industry || 'Active'}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-purple-400" />
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                  {c.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                  {c.description || c.goal || 'AI-generated multi-channel marketing plan'}
                </CardDescription>
              </CardHeader>

              <CardContent className="py-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-foreground">
                  <span>Budget: <strong className="text-white">{c.budget || 'Custom'}</strong></span>
                  <span>Goal: <strong className="text-purple-300">{c.goal || 'Lead Gen'}</strong></span>
                </div>
              </CardContent>

              <CardFooter className="border-t border-white/5 pt-4 flex justify-between items-center text-xs">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(c.id, c.title)}
                  className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                  title="Delete Campaign"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <Link to={`/campaigns/${c.id}`} className="text-purple-400 font-semibold hover:text-purple-300 flex items-center gap-1.5 hover:underline">
                  View Strategy & Creatives <ArrowUpRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
