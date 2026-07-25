import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/common/Navbar'

export function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: 'Free',
      badge: 'Starter',
      priceMonthly: '₹0',
      priceYearly: '₹0',
      description: 'Perfect for exploring AI marketing strategy generation.',
      features: [
        '1 campaign credit / month',
        'Basic AI campaign generation',
        'Buyer Persona generator',
        'Google & Facebook ad copy',
        'Community support',
      ],
      cta: 'Get Started Free',
      ctaVariant: 'outline' as const,
      popular: false,
      link: '/register',
    },
    {
      name: 'Pro',
      badge: 'Most Popular',
      priceMonthly: '₹3,999',
      priceYearly: '₹3,199',
      description: 'Ideal for marketers and growing teams building weekly campaigns.',
      features: [
        'Unlimited campaigns / month',
        'Faster Gemini 2.5 Flash AI generation',
        'All platforms (Google, FB, IG, LinkedIn)',
        'SEO Keywords & Hashtag generator',
        'Full Campaign History & Export',
        'Priority Customer Support',
      ],
      cta: 'Upgrade to Pro',
      ctaVariant: 'default' as const,
      popular: true,
      link: '/developer-info',
    },
    {
      name: 'Enterprise',
      badge: 'Organizations',
      priceMonthly: '₹15,999',
      priceYearly: '₹12,799',
      description: 'Custom AI models, team collaboration, and dedicated assistance.',
      features: [
        'Everything in Pro',
        'Team Workspace & RBAC permissions',
        'API Access for custom integrations',
        'Custom Brand Tone fine-tuning',
        'Dedicated Account Manager',
        'SLA & Uptime Guarantees',
      ],
      cta: 'Contact Enterprise',
      ctaVariant: 'outline' as const,
      popular: false,
      link: '/developer-info',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        {/* Header Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" /> Simple, Transparent INR Pricing
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Flexible Plans for Every <span className="gradient-text">Marketing Team</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Start for free and scale as your AI campaign requirements grow.
          </p>

          {/* Billing Toggle Switch */}
          <div className="pt-6 flex items-center justify-center gap-4">
            <span className={`text-sm font-semibold ${!isYearly ? 'text-white' : 'text-muted-foreground'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-purple-500/30 bg-secondary/80 p-0.5 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-purple-500 shadow-md transition duration-200 ease-in-out ${
                  isYearly ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-1.5 ${isYearly ? 'text-white' : 'text-muted-foreground'}`}>
              Yearly Billing
              <Badge variant="success" className="text-[10px] px-2 py-0.5">Save 20%</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={`glass-panel hover-lift rounded-3xl relative flex flex-col justify-between p-8 ${
                plan.popular ? 'border-2 border-purple-500/60 shadow-2xl shadow-purple-500/20' : 'border border-white/10'
              }`}
            >
              <div>
                <CardHeader className="p-0 space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge variant={plan.popular ? 'success' : 'default'}>{plan.badge}</Badge>
                  </div>
                  <CardTitle className="text-2xl font-extrabold text-white">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-4xl font-extrabold text-white tracking-tight">
                      {isYearly ? plan.priceYearly : plan.priceMonthly}
                    </span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0 pt-6 space-y-3">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider block">Features included:</span>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-white/90">
                        <Check className="h-4 w-4 text-purple-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <CardFooter className="p-0 pt-8">
                <Link to={plan.link} className="w-full">
                  <Button
                    size="lg"
                    variant={plan.ctaVariant}
                    className={`w-full gap-2 font-semibold rounded-xl ${
                      plan.popular ? 'shadow-xl shadow-purple-600/30' : ''
                    }`}
                  >
                    {plan.cta} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
