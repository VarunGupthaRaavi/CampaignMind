import { MetricCard } from '@/components/analytics/MetricCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { TrendingUp, MousePointerClick, Target, DollarSign } from 'lucide-react'

export function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Impressions" value="284,500" change="+32%" icon={TrendingUp} />
        <MetricCard title="Total Clicks" value="14,210" change="+15%" icon={MousePointerClick} />
        <MetricCard title="Avg. CTR" value="4.99%" change="+0.8%" icon={Target} />
        <MetricCard title="Total Ad Spend" value="$8,450" change="-5%" icon={DollarSign} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Channel Conversions & ROI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { channel: 'LinkedIn Sponsored Content', conversions: 420, rate: '6.2%' },
              { channel: 'Email Drip Sequence', conversions: 680, rate: '8.4%' },
              { channel: 'Google Search Ads', conversions: 310, rate: '3.9%' },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/40 border border-white/5">
                <span className="font-semibold text-white">{row.channel}</span>
                <div className="flex gap-6 text-sm">
                  <span className="text-muted-foreground">Conversions: <strong className="text-white">{row.conversions}</strong></span>
                  <span className="text-muted-foreground">Conv. Rate: <strong className="text-emerald-400">{row.rate}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
