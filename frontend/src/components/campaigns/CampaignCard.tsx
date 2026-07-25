import { Link } from 'react-router-dom'
import { ArrowUpRight, Calendar, Layers } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Campaign } from '@/types/campaign'

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Card className="glass-panel hover-lift rounded-2xl relative overflow-hidden flex flex-col justify-between">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="success">
            {campaign.industry || 'Active'}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-purple-400" />
            {new Date(campaign.created_at).toLocaleDateString()}
          </span>
        </div>
        <CardTitle className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
          {campaign.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
          {campaign.description || campaign.goal || 'AI-generated campaign strategy'}
        </CardDescription>
      </CardHeader>

      <CardContent className="py-2 text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-foreground">
          <span>Goal: <strong className="text-purple-300">{campaign.goal || 'Lead Generation'}</strong></span>
          {campaign.tone && <span>Tone: <strong className="text-white">{campaign.tone}</strong></span>}
        </div>
      </CardContent>

      <CardFooter className="border-t border-white/5 pt-4 flex justify-between items-center text-xs">
        <span className="text-muted-foreground flex items-center gap-1">
          <Layers className="h-3.5 w-3.5 text-emerald-400" /> Budget: {campaign.budget || 'Custom'}
        </span>
        <Link to={`/campaigns/${campaign.id}`} className="text-purple-400 font-semibold hover:text-purple-300 flex items-center gap-1 hover:underline">
          View Details <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  )
}
