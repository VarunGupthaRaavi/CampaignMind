import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Sparkles,
  Trash2,
  Edit,
  Calendar,
  Copy,
  Check,
  Target,
  IndianRupee,
  AlertTriangle,
  ArrowLeft,
  Search,
  Instagram,
  Linkedin,
  Facebook,
  Hash,
  Key,
  PieChart,
  UserCheck,
  Compass,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { useCampaignDetail, useDeleteCampaign } from '@/hooks/useCampaigns'
import { updateCampaign } from '@/api/campaigns'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Helper to safely extract clean readable text from stringified JSON or nested objects
 */
function formatContentText(val: any): string {
  if (!val) return ''
  if (typeof val === 'string') {
    const trimmed = val.trim()
    if (trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed)
        return formatContentText(parsed)
      } catch {
        return val
      }
    }
    return val
  }
  if (typeof val === 'object') {
    if (val.description) return String(val.description)
    if (val.core_message) return String(val.core_message)
    if (val.summary) return String(val.summary)
    return Object.entries(val)
      .map(([k, v]) => `${k.replace(/_/g, ' ').toUpperCase()}: ${Array.isArray(v) ? v.join(', ') : typeof v === 'object' ? JSON.stringify(v) : v}`)
      .join('\n\n')
  }
  return String(val)
}

/**
 * Parses numeric average INR budget from string range
 */
function parseTotalBudget(budgetString?: string): number {
  if (!budgetString) return 600000
  const clean = budgetString.replace(/,/g, '').replace(/₹/g, '').replace(/\$/g, '')
  const numbers = clean.match(/\d+/g)?.map(Number) || []
  if (numbers.length === 0) return 600000
  if (numbers.length === 1) return numbers[0]
  return Math.round((numbers[0] + numbers[1]) / 2)
}

/**
 * Formats amount in INR currency format (e.g. ₹6,00,000)
 */
function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Calculates dollar amount for platform allocation in INR Rupee
 */
function calculateChannelAmount(totalBudget: number, percentageStr: string): string {
  const pct = parseInt(String(percentageStr).replace('%', '')) || 0
  const amount = Math.round(totalBudget * (pct / 100))
  return formatINR(amount)
}

/**
 * Curated high-res Unsplash visual banners for ad previews
 */
function getAdImage(index: number): string {
  const images = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  ]
  return images[index % images.length]
}

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: campaign, isLoading, error } = useCampaignDetail(id)
  const deleteCampaignMutation = useDeleteCampaign()

  // Copy state tracker
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editIndustry, setEditIndustry] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editBudget, setEditBudget] = useState('')
  const [editGoal, setEditGoal] = useState('')
  const [editTone, setEditTone] = useState('')

  useEffect(() => {
    if (campaign) {
      setEditTitle(campaign.title || '')
      setEditIndustry(campaign.industry || 'Technology & SaaS')
      setEditDescription(campaign.description || '')
      setEditBudget(campaign.budget || '₹2,00,000 - ₹10,00,000 / month')
      setEditGoal(campaign.goal || 'Lead Generation')
      setEditTone(campaign.tone || 'Professional')
    }
  }, [campaign])

  const handleCopy = (text: string, elementId: string, label: string = 'Content') => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedId(elementId)
    toast('Copied to Clipboard!', `${label} copied successfully.`, 'success')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async () => {
    if (campaign && window.confirm(`Are you sure you want to delete campaign "${campaign.title}"?`)) {
      try {
        await deleteCampaignMutation.mutateAsync(campaign.id)
        toast('Campaign Deleted', `"${campaign.title}" has been deleted.`, 'info')
        navigate('/campaigns')
      } catch (err: any) {
        toast('Delete Failed', err?.message || 'Could not delete campaign.', 'error')
      }
    }
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!campaign) return
    setIsSavingEdit(true)
    try {
      await updateCampaign(campaign.id, {
        title: editTitle,
        industry: editIndustry,
        description: editDescription,
        budget: editBudget,
        goal: editGoal,
        tone: editTone,
      })
      queryClient.invalidateQueries({ queryKey: ['campaign', campaign.id] })
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast('Campaign Updated', 'Changes saved successfully to Supabase.', 'success')
      setIsEditOpen(false)
    } catch (err: any) {
      toast('Update Error', err?.message || 'Failed to update campaign.', 'error')
    } finally {
      setIsSavingEdit(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        <div className="space-y-4 pb-6 border-b border-white/10">
          <Skeleton className="h-10 w-2/3 rounded-xl" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-5 border border-dashed border-white/10 rounded-3xl bg-card/30">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-400 mx-auto border border-red-500/30 shadow-xl shadow-red-500/10">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Campaign Not Found or Access Restricted</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            You may not have permission to view this campaign or it has been deleted.
          </p>
        </div>
        <Link to="/campaigns" className="inline-block pt-2">
          <Button variant="outline" size="lg" className="gap-2 border-white/10">
            <ArrowLeft className="h-4 w-4" /> Back to Campaign History
          </Button>
        </Link>
      </div>
    )
  }

  const output: any = campaign.output || {}
  const rawPersona = output.buyer_persona || output.persona
  const rawStrategy = output.marketing_strategy

  const buyerPersonaText = formatContentText(rawPersona) || 'Target Buyer Persona for Education & EdTech: Students, Instructors, Faculty. Motivated by high ROI, rapid campaign generation, and operational efficiency.'
  const strategyText = formatContentText(rawStrategy) || 'Core Strategy for Nxtwave Ad: Position as the premier autonomous campaign planner for Education & EdTech. Focus on AI velocity and multi-channel consistency.'

  const googleAds = output.google_ads || []
  const facebookAds = output.facebook_ads || []
  const instagramAds = output.instagram_ads || []
  const linkedinAds = output.linkedin_ads || []
  const keywords = output.keywords || []
  const hashtags = output.hashtags || []
  const budgetBreakdown = output.budget_breakdown || {
    google: '35%',
    facebook: '25%',
    instagram: '20%',
    linkedin: '20%',
  }

  const totalMonthlyBudget = parseTotalBudget(campaign.budget)

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Campaign Header Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/campaigns">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-white rounded-xl">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">{campaign.title}</h2>
            <Badge variant="success" className="px-3 py-1 text-xs">{campaign.industry || 'Active'}</Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-purple-400" /> Created {new Date(campaign.created_at).toLocaleDateString()}</span>
            <span className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4 text-emerald-400" /> Budget: {campaign.budget || 'Custom'}</span>
            <span className="flex items-center gap-1.5"><Target className="h-4 w-4 text-indigo-400" /> Goal: {campaign.goal || 'Lead Generation'}</span>
            <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-pink-400" /> Tone: {campaign.tone || 'Professional'}</span>
          </div>
        </div>

        {/* Action Controls: Edit & Delete */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="gap-1.5 border-white/10 hover:bg-white/5 rounded-xl text-xs font-semibold"
          >
            <Edit className="h-4 w-4 text-purple-400" /> Edit Campaign
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-400 hover:bg-red-500/10 border-red-500/30 gap-1.5 rounded-xl text-xs font-semibold"
          >
            <Trash2 className="h-4 w-4" /> Delete Campaign
          </Button>
        </div>
      </div>

      {/* Modern Card Layout - 9 Deliverables Sections */}
      <div className="space-y-10">
        {/* Section 1 & 2: Buyer Persona & Marketing Strategy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section 1: Buyer Persona Card */}
          <Card className="glass-panel hover-lift rounded-2xl flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
              <CardTitle className="text-lg text-white flex items-center gap-2 font-bold">
                <UserCheck className="h-5 w-5 text-purple-400" /> Target Buyer Persona
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(buyerPersonaText, 'buyer_persona', 'Target Buyer Persona')}
                className="text-xs gap-1 rounded-xl"
              >
                {copiedId === 'buyer_persona' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedId === 'buyer_persona' ? 'Copied' : 'Copy Persona'}
              </Button>
            </CardHeader>
            <CardContent className="pt-4 text-sm leading-relaxed">
              <p className="whitespace-pre-line text-white/90">{buyerPersonaText}</p>
            </CardContent>
          </Card>

          {/* Section 2: Marketing Strategy Card */}
          <Card className="glass-panel hover-lift rounded-2xl flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
              <CardTitle className="text-lg text-white flex items-center gap-2 font-bold">
                <Compass className="h-5 w-5 text-indigo-400" /> Core Marketing Strategy
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(strategyText, 'strategy', 'Core Marketing Strategy')}
                className="text-xs gap-1 rounded-xl"
              >
                {copiedId === 'strategy' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedId === 'strategy' ? 'Copied' : 'Copy Strategy'}
              </Button>
            </CardHeader>
            <CardContent className="pt-4 text-sm leading-relaxed">
              <p className="whitespace-pre-line text-white/90">{strategyText}</p>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Google Ads Card Grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Google Search & PPC Ads</h3>
          </div>
          {googleAds.length === 0 ? (
            <Card className="glass-panel p-4 text-xs text-muted-foreground rounded-2xl">No Google Ads generated.</Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {googleAds.map((ad: any, i: number) => {
                const headlineText = ad.headline_1 || ad.headline || 'Top Education & EdTech AI Marketing Suite'
                const subHeadline = ad.headline_2 || 'Supercharge campaigns with Nxtwave Ad. Launch in seconds.'
                const descriptionText = ad.description_1 || ad.description || 'Stop manual marketing campaign bottlenecks. Nxtwave Ad generates complete strategies, ad copy, and keywords automatically.'
                const fullCopy = `${headlineText} | ${subHeadline}\n${descriptionText}`

                return (
                  <Card key={i} className="glass-panel hover-lift rounded-2xl relative flex flex-col justify-between overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <Badge variant="default" className="bg-blue-500/20 text-blue-300 border-blue-500/30">Google Ad</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(fullCopy, `g-${i}`, 'Google Ad')}
                        className="text-xs gap-1 rounded-xl"
                      >
                        {copiedId === `g-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedId === `g-${i}` ? 'Copied' : 'Copy Ad'}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs pt-1">
                      <div className="text-sm font-bold text-blue-400 hover:underline">
                        {headlineText} {subHeadline && `| ${subHeadline}`}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{descriptionText}</p>
                      {ad.call_to_action && (
                        <div className="pt-1">
                          <span className="text-[11px] font-semibold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 inline-block">
                            CTA: {ad.call_to_action}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Section 4: Facebook Ads Card Grid with Visual Images */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-bold text-white">Facebook Feed Ads & Visual Assets</h3>
          </div>
          {facebookAds.length === 0 ? (
            <Card className="glass-panel p-4 text-xs text-muted-foreground rounded-2xl">No Facebook Ads generated.</Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {facebookAds.map((ad: any, i: number) => {
                const primaryText = ad.primary_text || 'Automate your marketing workflow with AI precision 🚀. Try Nxtwave Ad today!'
                const headlineText = ad.headline || 'Scale Your Education & EdTech Growth Fast'
                const fullCopy = `${primaryText}\n\nHeadline: ${headlineText}`
                const adImage = ad.image_url || getAdImage(i)

                return (
                  <Card key={i} className="glass-panel hover-lift rounded-2xl relative flex flex-col justify-between overflow-hidden">
                    {/* Visual Asset Banner */}
                    <div className="relative h-48 w-full overflow-hidden bg-card/60">
                      <img
                        src={adImage}
                        alt="Facebook Ad Visual Preview"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                      <Badge className="absolute top-3 left-3 bg-blue-600/80 text-white backdrop-blur-md gap-1">
                        <ImageIcon className="h-3 w-3" /> Facebook Visual Asset
                      </Badge>
                    </div>

                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3">
                      <Badge variant="default" className="bg-blue-600/20 text-blue-300 border-blue-600/30">Facebook Feed Ad</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(fullCopy, `fb-${i}`, 'Facebook Ad')}
                        className="text-xs gap-1 rounded-xl"
                      >
                        {copiedId === `fb-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedId === `fb-${i}` ? 'Copied' : 'Copy Copy'}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs pt-1">
                      <p className="whitespace-pre-line text-white/90 leading-relaxed">{primaryText}</p>
                      <div className="p-3.5 rounded-xl bg-secondary/50 border border-white/5 space-y-1">
                        <p className="font-bold text-white text-sm">{headlineText}</p>
                        {ad.description && <p className="text-muted-foreground leading-relaxed">{ad.description}</p>}
                        {ad.call_to_action && <span className="inline-block text-[11px] text-purple-300 font-semibold mt-1">CTA: {ad.call_to_action}</span>}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Section 5: Instagram Ads Card Grid with Visual Images */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-pink-500" />
            <h3 className="text-lg font-bold text-white">Instagram Story & Reel Ads & Visual Assets</h3>
          </div>
          {instagramAds.length === 0 ? (
            <Card className="glass-panel p-4 text-xs text-muted-foreground rounded-2xl">No Instagram Ads generated.</Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {instagramAds.map((ad: any, i: number) => {
                const captionText = ad.caption || 'Scale your campaign creation with autonomous AI strategy tools. Try Nxtwave Ad today! 🚀'
                const visualPrompt = ad.visual_concept || 'Sleek dark mode dashboard graphics.'
                const fullCopy = `${captionText}\n\nVisual Prompt: ${visualPrompt}`
                const adImage = ad.image_url || getAdImage(i + 1)

                return (
                  <Card key={i} className="glass-panel hover-lift rounded-2xl relative flex flex-col justify-between overflow-hidden">
                    {/* Visual Asset Banner */}
                    <div className="relative h-48 w-full overflow-hidden bg-card/60">
                      <img
                        src={adImage}
                        alt="Instagram Ad Visual Preview"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                      <Badge className="absolute top-3 left-3 bg-pink-600/80 text-white backdrop-blur-md gap-1">
                        <ImageIcon className="h-3 w-3" /> Instagram Visual Asset
                      </Badge>
                    </div>

                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3">
                      <Badge variant="default" className="bg-pink-500/20 text-pink-300 border-pink-500/30">Instagram Ad</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(fullCopy, `ig-${i}`, 'Instagram Ad')}
                        className="text-xs gap-1 rounded-xl"
                      >
                        {copiedId === `ig-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedId === `ig-${i}` ? 'Copied' : 'Copy Caption'}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs pt-1">
                      <p className="whitespace-pre-line text-white/90 leading-relaxed">{captionText}</p>
                      {visualPrompt && (
                        <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-200">
                          <strong className="text-pink-300 block mb-1">Visual Concept / Image Prompt:</strong>
                          {visualPrompt}
                        </div>
                      )}
                      {ad.call_to_action && <span className="inline-block text-[11px] font-semibold text-purple-300">CTA: {ad.call_to_action}</span>}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Section 6: LinkedIn Ads Card Grid with Visual Images */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">LinkedIn B2B Sponsored Ads & Visual Assets</h3>
          </div>
          {linkedinAds.length === 0 ? (
            <Card className="glass-panel p-4 text-xs text-muted-foreground rounded-2xl">No LinkedIn Ads generated.</Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {linkedinAds.map((ad: any, i: number) => {
                const postText = ad.post_text || ad.headline || 'High-performing B2B marketing teams rely on Nxtwave Ad to streamline cross-channel messaging and buyer persona analysis.'
                const adImage = ad.image_url || getAdImage(i + 2)
                return (
                  <Card key={i} className="glass-panel hover-lift rounded-2xl relative flex flex-col justify-between overflow-hidden">
                    {/* Visual Asset Banner */}
                    <div className="relative h-48 w-full overflow-hidden bg-card/60">
                      <img
                        src={adImage}
                        alt="LinkedIn Ad Visual Preview"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                      <Badge className="absolute top-3 left-3 bg-indigo-600/80 text-white backdrop-blur-md gap-1">
                        <ImageIcon className="h-3 w-3" /> LinkedIn B2B Graphic
                      </Badge>
                    </div>

                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3">
                      <Badge variant="default" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">LinkedIn B2B Post</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(postText, `li-${i}`, 'LinkedIn Post')}
                        className="text-xs gap-1 rounded-xl"
                      >
                        {copiedId === `li-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedId === `li-${i}` ? 'Copied' : 'Copy Post'}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs pt-1">
                      <p className="whitespace-pre-line text-white/90 leading-relaxed">{postText}</p>
                      {ad.target_job_titles && (
                        <div className="flex gap-1.5 flex-wrap pt-1">
                          <span className="text-muted-foreground font-semibold">Target Titles:</span>
                          {ad.target_job_titles.map((t: string, idx: number) => (
                            <span key={idx} className="bg-secondary px-2 py-0.5 rounded text-purple-300">{t}</span>
                          ))}
                        </div>
                      )}
                      {ad.call_to_action && <span className="inline-block text-[11px] font-semibold text-purple-300">CTA: {ad.call_to_action}</span>}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Section 7 & 8: SEO Keywords & Hashtags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section 7: SEO Keywords Card */}
          <Card className="glass-panel hover-lift rounded-2xl flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
              <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                <Key className="h-5 w-5 text-amber-400" /> SEO & PPC Keywords
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(keywords.join(', '), 'kw', 'SEO Keywords')}
                className="text-xs gap-1 rounded-xl"
              >
                {copiedId === 'kw' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedId === 'kw' ? 'Copied All' : 'Copy All Keywords'}
              </Button>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-4">
              {keywords.map((kw: string, i: number) => (
                <span
                  key={i}
                  onClick={() => handleCopy(kw, `kw-${i}`, `Keyword "${kw}"`)}
                  className="text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 px-3.5 py-1.5 rounded-full cursor-pointer hover:bg-amber-500/20 transition-all hover:scale-105"
                  title="Click to copy keyword"
                >
                  {kw}
                </span>
              ))}
            </CardContent>
          </Card>

          {/* Section 8: Hashtags Card */}
          <Card className="glass-panel hover-lift rounded-2xl flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
              <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                <Hash className="h-5 w-5 text-purple-400" /> Social Media Hashtags
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(hashtags.join(' '), 'ht', 'Hashtags')}
                className="text-xs gap-1 rounded-xl"
              >
                {copiedId === 'ht' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedId === 'ht' ? 'Copied All' : 'Copy All Hashtags'}
              </Button>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-4">
              {hashtags.map((ht: string, i: number) => (
                <span
                  key={i}
                  onClick={() => handleCopy(ht, `ht-${i}`, `Hashtag "${ht}"`)}
                  className="text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 px-3.5 py-1.5 rounded-full cursor-pointer hover:bg-purple-500/20 transition-all hover:scale-105"
                  title="Click to copy hashtag"
                >
                  {ht}
                </span>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Section 9: Enhanced Budget Breakdown Card with Amount (₹) and Percentage (%) */}
        <Card className="glass-panel hover-lift rounded-2xl">
          <CardHeader className="border-b border-white/5 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                <PieChart className="h-5 w-5 text-emerald-400" /> 9. Channel Budget Allocation Breakdown
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Recommended distribution of estimated monthly budget across target platforms.</CardDescription>
            </div>
            <Badge variant="success" className="text-xs font-semibold px-3 py-1.5 gap-1.5">
              <IndianRupee className="h-4 w-4" /> Total Budget: {formatINR(totalMonthlyBudget)} / mo
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6 pt-6 max-w-4xl">
            {typeof budgetBreakdown === 'object' &&
              Object.entries(budgetBreakdown).map(([platformKey, percentage]) => {
                const pctStr = String(percentage)
                const pctValue = parseInt(pctStr.replace('%', '')) || 25
                const inrAmount = calculateChannelAmount(totalMonthlyBudget, pctStr)

                let IconComponent = Search
                let colorClass = 'text-blue-400 bg-blue-500/10 border-blue-500/20'

                if (platformKey.toLowerCase().includes('facebook')) {
                  IconComponent = Facebook
                  colorClass = 'text-blue-500 bg-blue-600/10 border-blue-600/20'
                } else if (platformKey.toLowerCase().includes('instagram')) {
                  IconComponent = Instagram
                  colorClass = 'text-pink-400 bg-pink-500/10 border-pink-500/20'
                } else if (platformKey.toLowerCase().includes('linkedin')) {
                  IconComponent = Linkedin
                  colorClass = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                }

                return (
                  <div key={platformKey} className="space-y-3 p-4 rounded-2xl bg-secondary/40 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl border ${colorClass}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-white text-sm capitalize">{platformKey} Platform</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-xs font-medium">Allocation: <strong className="text-white">{pctStr}</strong></span>
                        <span className="text-emerald-400 font-extrabold text-sm px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          {inrAmount} / month
                        </span>
                      </div>
                    </div>

                    <Progress value={pctValue} max={100} className="h-3 rounded-full" />
                  </div>
                )
              })}
          </CardContent>
        </Card>
      </div>

      {/* Edit Campaign Modal Dialog */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit className="h-5 w-5 text-purple-400" /> Edit Campaign Parameters
            </h3>
          </div>

          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white">Campaign Title</label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white">Industry</label>
                <Input value={editIndustry} onChange={(e) => setEditIndustry(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white">Budget Range (INR)</label>
                <Input value={editBudget} onChange={(e) => setEditBudget(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white">Product Description</label>
              <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white">Campaign Goal</label>
                <Input value={editGoal} onChange={(e) => setEditGoal(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white">Brand Tone</label>
                <Input value={editTone} onChange={(e) => setEditTone(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingEdit} className="rounded-xl shadow-lg shadow-purple-600/25">
                {isSavingEdit ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  )
}
