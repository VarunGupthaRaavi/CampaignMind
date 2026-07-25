import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export interface StrategyItem {
  channel: string
  key_message?: string
  tactics?: string[]
  positioning_pillars?: string[]
}

interface CampaignTimelineProps {
  strategies: StrategyItem[]
}

export function CampaignTimeline({ strategies }: CampaignTimelineProps) {
  return (
    <Card className="glass-panel rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white">Campaign Execution Strategy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {strategies.map((strat, idx) => (
          <div key={idx} className="flex gap-4 border-l-2 border-purple-500/30 pl-4 py-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 font-bold text-xs">
              {idx + 1}
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white">{strat.channel} Strategy</h4>
              {strat.key_message && <p className="text-sm text-muted-foreground">{strat.key_message}</p>}
              {(strat.tactics || strat.positioning_pillars) && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {(strat.tactics || strat.positioning_pillars || []).map((tactic: string, tIdx: number) => (
                    <span key={tIdx} className="text-xs flex items-center gap-1 text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                      <CheckCircle2 className="h-3 w-3" /> {tactic}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
