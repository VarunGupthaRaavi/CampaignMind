import { Campaign } from '@/types/campaign'
import { CampaignCard } from './CampaignCard'

interface CampaignListProps {
  campaigns: Campaign[]
}

export function CampaignList({ campaigns }: CampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-card/20">
        <h3 className="text-lg font-semibold text-white">No campaigns created yet</h3>
        <p className="text-sm text-muted-foreground mt-1">Start by creating your first AI-assisted marketing plan.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((c) => (
        <CampaignCard key={c.id} campaign={c} />
      ))}
    </div>
  )
}
