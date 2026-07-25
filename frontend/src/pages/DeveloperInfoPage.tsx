import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, ShieldCheck, ArrowLeft, Copy, Check, Sparkles, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/toast'
import { Navbar } from '@/components/common/Navbar'

export function DeveloperInfoPage() {
  const { toast } = useToast()
  const [copiedPaypal, setCopiedPaypal] = useState(false)
  const [isSimulatedPaid, setIsSimulatedPaid] = useState(false)

  const paypalId = 'varundarling7165@gmail.com'

  const handleCopyPaypal = () => {
    navigator.clipboard.writeText(paypalId)
    setCopiedPaypal(true)
    toast('PayPal ID Copied!', 'varundarling7165@gmail.com copied to clipboard.', 'success')
    setTimeout(() => setCopiedPaypal(false), 2000)
  }

  const handlePaypalClick = () => {
    setIsSimulatedPaid(true)
    toast(
      'PayPal Transfer Initiated! 💸',
      'Your 100-day countdown has officially started. Grab a cup of coffee and check back in 100 days 😏☕!',
      'success'
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-center items-center">
        <Card className="glass-panel rounded-3xl border-purple-500/40 bg-gradient-to-b from-purple-950/40 via-card to-card p-4 sm:p-8 shadow-2xl w-full text-center space-y-8">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 mx-auto backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" /> Developer Payment Portal 😏
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Upgrade Account & <span className="gradient-text">Developer Info</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              To upgrade your plan to <strong className="text-purple-300">Pro</strong> or <strong className="text-indigo-300">Enterprise</strong>, please pay the exact plan amount directly via PayPal to the developer and wait for 100 days 😏.
            </p>
          </div>

          {/* Sarcastic Developer Info Card */}
          <div className="p-6 rounded-2xl bg-secondary/50 border border-white/10 text-left space-y-5 max-w-2xl mx-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-400" /> Developer PayPal Address
              </span>
              <Badge variant="success">Verified Dev Account 😏</Badge>
            </div>

            {/* PayPal ID Box */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-background/80 border border-white/10">
              <span className="font-mono text-sm text-purple-300 font-semibold truncate">{paypalId}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyPaypal}
                className="gap-1 text-xs rounded-xl hover:bg-purple-500/20"
              >
                {copiedPaypal ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedPaypal ? 'Copied' : 'Copy PayPal ID'}
              </Button>
            </div>

            {/* 100-Day Wait Status Bar */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-400" /> Account Activation Wait Time
                </span>
                <span className="text-amber-300 font-bold">{isSimulatedPaid ? '1 / 100 Days Wait 😏' : '0 / 100 Days Wait 😏'}</span>
              </div>
              <Progress value={isSimulatedPaid ? 1 : 0} max={100} className="h-3 rounded-full" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Please pay the amount via PayPal and wait patiently for 100 business days for manual review and activation 😏☕.
              </p>
            </div>
          </div>

          {/* Sarcastic Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={handlePaypalClick}
              className="w-full sm:w-auto gap-2 shadow-xl shadow-purple-600/30 font-semibold rounded-xl px-8 py-6 text-base"
            >
              Pay via PayPal & Wait 100 Days 😏 <ExternalLink className="h-4 w-4" />
            </Button>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 rounded-xl px-6 border-white/10">
                <ArrowLeft className="h-4 w-4" /> Back to Pricing
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-muted-foreground">
        © 2026 CampaignMind Developer Portal 😏. All activation requests take 100 days.
      </footer>
    </div>
  )
}
