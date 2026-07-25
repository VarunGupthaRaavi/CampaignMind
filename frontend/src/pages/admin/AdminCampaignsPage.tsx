import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Search, Trash2, ArrowUpRight, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { apiClient } from '@/lib/api-client'
import { APIResponse } from '@/types/api'
import { Campaign } from '@/types/campaign'

export function AdminCampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['admin-campaigns', searchTerm],
    queryFn: async () => {
      const url = searchTerm ? `/admin/campaigns?query=${encodeURIComponent(searchTerm)}` : '/admin/campaigns'
      const res = await apiClient<APIResponse<Campaign[]>>(url)
      return res.data
    },
  })

  const deleteCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const res = await apiClient<APIResponse<boolean>>(`/admin/campaigns/${campaignId}`, {
        method: 'DELETE',
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast('Campaign Deleted', 'The campaign was deleted by administrator.', 'info')
    },
    onError: (err: any) => {
      toast('Delete Failed', err?.message || 'Could not delete campaign.', 'error')
    },
  })

  const handleDelete = (c: Campaign) => {
    if (window.confirm(`Admin Delete: Are you sure you want to delete "${c.title}"?`)) {
      deleteCampaignMutation.mutate(c.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Global Campaign Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Review all campaigns created across all platform users.</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaign title or industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="glass-panel rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg text-white">All Platform Campaigns ({(campaigns || []).length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : (
            <table className="w-full text-left text-xs text-muted-foreground">
              <thead className="bg-white/5 text-white uppercase text-[11px] font-semibold">
                <tr>
                  <th className="p-4">Campaign Title</th>
                  <th className="p-4">Industry</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(campaigns || []).map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm line-clamp-1">{c.title}</div>
                      <div className="text-muted-foreground text-xs">{c.goal || 'Lead Gen'}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant="success" className="px-2.5 py-0.5">
                        {c.industry || 'Active'}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium text-white">{c.budget || 'Custom'}</td>
                    <td className="p-4">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <Link to={`/campaigns/${c.id}`}>
                        <Button variant="ghost" size="sm" className="text-purple-400 gap-1">
                          View <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(c)}
                        className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                        title="Delete Campaign"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
