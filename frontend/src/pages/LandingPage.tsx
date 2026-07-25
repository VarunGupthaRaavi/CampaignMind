import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  Bot,
  Target,
  BarChart,
  UserCheck,
  Compass,
  Search,
  Facebook,
  Instagram,
  Linkedin,
  IndianRupee,
  BadgeCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/common/Navbar'

export function LandingPage() {
  const featuredUserCampaigns = [
    {
      id: 'demo-1',
      title: 'Nxtwave EdTech AI Growth Suite',
      industry: 'Education & EdTech',
      budget: '₹2,00,000 - ₹10,00,000 / month',
      goal: 'Lead Generation',
      persona: 'Target Buyer Persona for Education & EdTech: Students, Instructors, Faculty. Motivated by high ROI, rapid campaign generation, and operational efficiency.',
      strategy: 'Position as the premier autonomous campaign planner for Education & EdTech. Focus on AI velocity and multi-channel consistency.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      googleAd: 'Top Education & EdTech AI Marketing Suite | Supercharge campaigns with Nxtwave Ad.',
      facebookAd: 'Stop manual marketing campaign bottlenecks. Nxtwave Ad generates complete strategies, ad copy, and keywords automatically.',
    },
    {
      id: 'demo-2',
      title: 'FinTech Pulse AI Wealth Engine',
      industry: 'Financial Services & Fintech',
      budget: '₹10,00,000 - ₹50,00,000 / month',
      goal: 'Direct Sales & Revenue',
      persona: 'Wealth managers, CFOs, financial advisors seeking automated compliance-ready portfolio marketing.',
      strategy: 'Build trust with data-backed financial analytics ads, LinkedIn leadership content, and search intent targeting.',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      googleAd: 'Autonomous Wealth Management Suite | Scale AUM fast with verified AI strategies.',
      facebookAd: 'Automate portfolio marketing with bank-grade security & real-time lead analytics.',
    },
    {
      id: 'demo-3',
      title: 'Acme SaaS Workflow Assistant',
      industry: 'Technology & SaaS',
      budget: '₹50,000 - ₹2,00,000 / month',
      goal: 'Product Launch & Early Access',
      persona: 'Engineering leads, CTOs, and Product Managers looking to optimize dev velocity.',
      strategy: 'Highlight 10x workflow acceleration using social proof videos, code snippet carousel ads, and search PPC.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      googleAd: 'Acme AI Assistant Q3 Launch | 10x Developer Productivity in 1-Click.',
      facebookAd: 'Tired of manual workflow bottlenecks? Try Acme AI Assistant free for 14 days.',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-purple-600/30 via-indigo-600/20 to-pink-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 mb-6 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" /> Powered by Gemini 2.5 Flash API
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-white leading-tight">
          Supercharge Your Marketing Strategy with <span className="gradient-text">Autonomous AI</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Generate complete multi-channel campaigns, target buyer personas, creative visual ads, and INR budget breakdowns in seconds.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/register">
            <Button size="lg" className="gap-2 shadow-xl shadow-purple-600/30 font-semibold px-8 py-6 text-base rounded-xl">
              Start Free Trial (1 Free Campaign) <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/features">
            <Button size="lg" variant="outline" className="rounded-xl px-6 border-white/10">
              Explore Features
            </Button>
          </Link>
        </div>

        {/* Core Value Pillars Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full text-left">
          <div className="glass-panel p-6 rounded-2xl hover-lift">
            <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Gemini 2.5 Flash AI</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Generate buyer personas, multi-channel ad creatives, and SEO keywords in under 5 seconds.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover-lift">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Target Persona Intelligence</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Extract precise customer demographics, key pain points, and strategic positioning automatically.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover-lift">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <IndianRupee className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">INR Budget Allocator</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Calculate exact platform spend in Indian Rupees (₹) across Google, Facebook, Instagram, and LinkedIn.
            </p>
          </div>
        </div>
      </section>

      {/* Featured AI Campaigns Showcase Section for 1st Time Visitors */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 border-t border-white/10 w-full">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="success" className="px-3 py-1 text-xs gap-1.5">
            <BadgeCheck className="h-3.5 w-3.5" /> Featured User Campaigns
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            See What Other Users Are <span className="gradient-text">Building</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Explore live AI-generated marketing campaigns created by teams across technology, education, and finance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredUserCampaigns.map((camp) => (
            <Card key={camp.id} className="glass-panel hover-lift rounded-3xl overflow-hidden flex flex-col justify-between border-white/10">
              <div className="relative h-44 w-full overflow-hidden bg-card">
                <img
                  src={camp.image}
                  alt={camp.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                <Badge className="absolute top-3 left-3 bg-purple-600/80 text-white backdrop-blur-md">
                  {camp.industry}
                </Badge>
              </div>

              <CardHeader className="p-6 space-y-2">
                <CardTitle className="text-lg font-bold text-white line-clamp-1">{camp.title}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {camp.persona}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 py-0 space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-secondary/40 border border-white/5 space-y-1">
                  <span className="text-[11px] font-semibold text-blue-400 block">Google Search Ad Preview</span>
                  <p className="text-white/90 line-clamp-2 font-medium">{camp.googleAd}</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/40 border border-white/5 space-y-1">
                  <span className="text-[11px] font-semibold text-pink-400 block">Facebook Ad Copy Preview</span>
                  <p className="text-white/90 line-clamp-2 font-medium">{camp.facebookAd}</p>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-4 flex items-center justify-between border-t border-white/5 mt-4 text-xs">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5" /> {camp.budget}
                </span>
                <Link to="/register">
                  <Button size="sm" variant="ghost" className="text-purple-300 hover:text-white gap-1 rounded-xl text-xs">
                    Create Yours <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-muted-foreground">
        © 2026 CampaignMind Inc. Powered by Google Gemini 2.5 Flash API. Built for Production.
      </footer>
    </div>
  )
}
