import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Building, Mail, Zap, Shield, Sparkles, Check, ArrowRight, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/toast'
import { useAuth } from '@/hooks/useAuth'
import { useUserCampaigns } from '@/hooks/useCampaigns'
import { updateUserProfile } from '@/api/auth'

export function SettingsPage() {
  const { user, dbUser, syncUser } = useAuth()
  const { data: campaigns } = useUserCampaigns()
  const { toast } = useToast()

  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const campaignCount = (campaigns || []).length
  const maxFreeCredits = 1
  const creditsRemaining = Math.max(0, maxFreeCredits - campaignCount)
  const creditUsagePct = Math.min(100, Math.round((campaignCount / maxFreeCredits) * 100))

  useEffect(() => {
    if (dbUser) {
      setFullName(dbUser.full_name || '')
      setCompanyName(dbUser.company_name || '')
    }
  }, [dbUser])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateUserProfile({
        full_name: fullName,
        company_name: companyName,
      })
      await syncUser()
      toast('Settings Saved', 'Your profile settings have been updated.', 'success')
    } catch (err: any) {
      toast('Update Failed', err?.message || 'Could not save settings.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Account & Workspace Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account profile, campaign credits, and AI engine preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left 2 Columns: Profile & Account Settings */}
        <div className="md:col-span-2 space-y-6">
          <Card className="glass-panel rounded-2xl border-white/10">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-purple-400" /> User Profile Information
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Update your personal account information and company name.</CardDescription>
            </CardHeader>

            <form onSubmit={handleSaveProfile}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sarah Connor"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-muted-foreground" /> Company / Organization
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Growth Marketing"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Work Email
                  </label>
                  <Input value={user?.email || dbUser?.email || ''} disabled className="bg-secondary/40 text-muted-foreground" />
                  <p className="text-[11px] text-muted-foreground">Email is managed through Supabase Auth.</p>
                </div>
              </CardContent>

              <CardFooter className="border-t border-white/5 pt-4">
                <Button type="submit" disabled={isSaving} className="gap-2 shadow-lg shadow-purple-600/25 rounded-xl">
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* AI Engine & Security Settings */}
          <Card className="glass-panel rounded-2xl border-white/10">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" /> AI Engine & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6 text-xs">
              <div className="flex justify-between items-center p-3.5 rounded-xl bg-secondary/30 border border-white/5">
                <div>
                  <span className="font-bold text-white block">Active AI Model</span>
                  <span className="text-muted-foreground">Google Gemini 2.5 Flash API</span>
                </div>
                <Badge variant="success">Online</Badge>
              </div>

              <div className="flex justify-between items-center p-3.5 rounded-xl bg-secondary/30 border border-white/5">
                <div>
                  <span className="font-bold text-white block">Row-Level Database Security</span>
                  <span className="text-muted-foreground">Supabase JWT Authorization</span>
                </div>
                <Badge variant="default" className="bg-purple-500/20 text-purple-300">Protected</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Campaign Credits & Plan Status */}
        <div className="space-y-6">
          <Card className="glass-panel rounded-2xl border-purple-500/30 bg-gradient-to-b from-purple-950/40 via-card to-card p-2 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <Badge variant="success">Free Tier</Badge>
                <Zap className="h-5 w-5 text-amber-400" />
              </div>
              <CardTitle className="text-xl font-extrabold text-white pt-2">Campaign Credits</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Free plan includes {maxFreeCredits} AI campaign creation credit.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2 p-4 rounded-xl bg-secondary/50 border border-white/5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">Credits Used</span>
                  <span className="text-purple-300 font-bold">{campaignCount} / {maxFreeCredits}</span>
                </div>
                <Progress value={creditUsagePct} max={100} className="h-2.5" />
                <span className="text-[11px] text-muted-foreground block pt-1">
                  {creditsRemaining === 0 ? '0 Free credits remaining' : '1 Free credit available'}
                </span>
              </div>

              {campaignCount >= maxFreeCredits && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                  <strong className="block font-bold">Credit Limit Reached</strong>
                  <span>You have used your free campaign credit. Upgrade to Pro for unlimited AI campaign generation.</span>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-2">
              <Link to="/developer-info" className="w-full">
                <Button size="lg" className="w-full gap-2 font-semibold shadow-xl shadow-purple-600/30 rounded-xl">
                  Upgrade to Pro <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
