import { Link } from 'react-router-dom'
import { Sparkles, Bot, Target, Layers, DollarSign, History, Database, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/common/Navbar'

export function FeaturesPage() {
  const features = [
    {
      icon: Bot,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
      title: 'AI Campaign Generation',
      description: 'Powered by Gemini 2.5 Flash API. Input your product specs to generate comprehensive marketing strategies in seconds.',
    },
    {
      icon: Target,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      title: 'Buyer Persona Generator',
      description: 'Automatically discover ideal target demographics, pain points, key motivators, and high-converting channels.',
    },
    {
      icon: Layers,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10 border-pink-500/20',
      title: 'Multi-platform Ad Generator',
      description: 'Instant ad creative generation for Google Search, Facebook Feed, Instagram Stories/Reels, and LinkedIn B2B posts.',
    },
    {
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      title: 'Strategic Budget Planner',
      description: 'Get recommended percentage budget distribution across ad channels tailored to your campaign objectives.',
    },
    {
      icon: History,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      title: 'Campaign History & Management',
      description: 'Access, search, filter, edit, or delete all your saved AI marketing campaigns in one unified dashboard.',
    },
    {
      icon: Database,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      title: 'Secure Supabase Storage',
      description: 'Enterprise-grade PostgreSQL database with row-level user authorization ensuring your data is private and secure.',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* Header Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" /> Next-Gen AI Marketing Features
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Everything You Need to Scale <span className="gradient-text">Marketing Velocity</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Eliminate weeks of manual campaign planning with CampaignMind autonomous strategy tools.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <Card key={i} className="glass-panel hover-lift rounded-2xl border border-white/10 p-6 flex flex-col justify-between">
                <CardHeader className="p-0 space-y-3">
                  <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center ${f.bg} ${f.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-3">
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/80 via-indigo-950/60 to-card p-10 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Ready to generate your first AI campaign?</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Join top marketers using CampaignMind to automate cross-channel positioning and copy generation.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button size="lg" className="gap-2 shadow-xl shadow-purple-600/30 font-semibold">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
