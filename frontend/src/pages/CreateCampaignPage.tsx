import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, AlertTriangle, ArrowRight, Layers, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CampaignForm, CampaignFormValues } from '@/components/campaigns/CampaignForm'
import { useCreateAndGenerateCampaign, useUserCampaigns } from '@/hooks/useCampaigns'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function CreateCampaignPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()
  const { dbUser } = useAuth()
  const { data: userCampaigns } = useUserCampaigns()
  const createAndGenerate = useCreateAndGenerateCampaign()

  const campaignCount = (userCampaigns || []).length
  const isFreePlan = dbUser?.role !== 'admin'
  const isLimitReached = isFreePlan && campaignCount >= 1

  const handleFormSubmit = async (values: CampaignFormValues) => {
    setErrorMessage(null)
    try {
      const result = await createAndGenerate.mutateAsync({
        title: values.title,
        description: values.description,
        industry: values.industry,
        target_audience: values.target_audience,
        budget: values.budget,
        goal: values.goal,
        tone: values.tone,
        channels: values.platforms,
      })

      if (result && result.id) {
        navigate(`/campaigns/${result.id}`)
      } else {
        navigate('/campaigns')
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create campaign and generate AI deliverables. Please try again.')
    }
  }

  if (createAndGenerate.isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <LoadingSpinner label="Gemini 2.5 Flash is generating your marketing campaign deliverables..." />
        <p className="text-xs text-muted-foreground max-w-md text-center">
          Building buyer persona, cross-channel strategy, Google/Facebook/Instagram/LinkedIn ads, SEO keywords, and budget allocations...
        </p>
      </div>
    )
  }

  if (isLimitReached) {
    const existingCampaign = userCampaigns?.[0]
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="glass-panel rounded-3xl border-purple-500/30 bg-gradient-to-b from-purple-950/30 via-card to-card p-4 shadow-2xl text-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-400 mx-auto border border-amber-500/30 shadow-xl shadow-amber-500/10">
            <Zap className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="success" className="px-3 py-1 text-xs">
              1 / 1 Free Credit Used
            </Badge>
            <h2 className="text-2xl font-extrabold text-white">Free Plan Limit Reached</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Your free tier account includes 1 full AI marketing campaign credit. Upgrade to Pro for unlimited AI campaign generation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-secondary/50 border border-white/5 max-w-md mx-auto text-xs space-y-2 text-left">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">Your Created Campaign:</span>
              <span className="text-purple-300 font-semibold">{existingCampaign?.title}</span>
            </div>
            <p className="text-muted-foreground">
              {existingCampaign?.industry || 'Technology'} • Created {existingCampaign ? new Date(existingCampaign.created_at).toLocaleDateString() : ''}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link to="/developer-info">
              <Button size="lg" className="w-full sm:w-auto gap-2 shadow-xl shadow-purple-600/30 font-semibold rounded-xl px-8">
                <Sparkles className="h-4 w-4" /> Upgrade to Pro <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {existingCampaign && (
              <Link to={`/campaigns/${existingCampaign.id}`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 rounded-xl border-white/10">
                  <Layers className="h-4 w-4 text-purple-400" /> View My Campaign
                </Button>
              </Link>
            )}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {errorMessage && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      <CampaignForm onSubmit={handleFormSubmit} isSubmitting={createAndGenerate.isPending} />
    </div>
  )
}
