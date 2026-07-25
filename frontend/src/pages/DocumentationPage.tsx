import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Key, Sparkles, History, HelpCircle, Code, ShieldCheck, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/common/Navbar'
import { Button } from '@/components/ui/button'

export function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('getting-started')

  const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
    { id: 'authentication', label: 'Authentication', icon: ShieldCheck },
    { id: 'creating-campaigns', label: 'Creating Campaigns', icon: Sparkles },
    { id: 'using-ai', label: 'Using AI Engine', icon: Key },
    { id: 'campaign-history', label: 'Campaign History', icon: History },
    { id: 'faqs', label: 'Frequently Asked Questions', icon: HelpCircle },
    { id: 'api-overview', label: 'API Overview', icon: Code },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Sticky Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0 md:sticky md:top-24 glass-panel p-4 rounded-2xl space-y-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase px-3 py-2">Documentation</h3>
            {sections.map((sec) => {
              const Icon = sec.icon
              const isActive = activeSection === sec.id
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-500/20 text-white border border-purple-500/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-purple-400' : 'text-muted-foreground'}`} />
                    {sec.label}
                  </span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-purple-400" />}
                </button>
              )
            })}
          </aside>

          {/* Main Documentation Content Area */}
          <article className="flex-1 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 text-sm leading-relaxed text-muted-foreground border border-white/10">
            {activeSection === 'getting-started' && (
              <section className="space-y-4">
                <h2 className="text-2xl font-extrabold text-white">Getting Started with CampaignMind</h2>
                <p>
                  CampaignMind is an autonomous AI-powered marketing campaign planner designed for SaaS companies, digital agencies, and growth teams.
                </p>
                <h3 className="text-lg font-bold text-white pt-2">Quickstart Checklist</h3>
                <ul className="list-disc list-inside space-y-2 text-white/90">
                  <li>Create a free account or sign in with your email.</li>
                  <li>Navigate to <strong>New Campaign</strong> from the dashboard sidebar.</li>
                  <li>Fill in your product description, target audience, budget range, and brand tone.</li>
                  <li>Click <strong>Generate Full Campaign</strong> to let Gemini 2.5 Flash API build your strategy.</li>
                </ul>
              </section>
            )}

            {activeSection === 'authentication' && (
              <section className="space-y-4">
                <h2 className="text-2xl font-extrabold text-white">Authentication & Security</h2>
                <p>
                  CampaignMind leverages <strong>Supabase Auth</strong> for JWT token management and secure user session persistence.
                </p>
                <h3 className="text-lg font-bold text-white pt-2">JWT Verification</h3>
                <p>
                  Every request sent to the FastAPI backend includes a Bearer JWT token in the <code>Authorization</code> header. The backend decodes and verifies token claims using row-level authorization.
                </p>
              </section>
            )}

            {activeSection === 'creating-campaigns' && (
              <section className="space-y-4">
                <h2 className="text-2xl font-extrabold text-white">Creating Marketing Campaigns</h2>
                <p>
                  The Campaign Creation form uses <strong>React Hook Form</strong> and <strong>Zod validation</strong> to ensure required fields (title, description, audience, budget, goal, tone) are validated before dispatching to the backend.
                </p>
              </section>
            )}

            {activeSection === 'using-ai' && (
              <section className="space-y-4">
                <h2 className="text-2xl font-extrabold text-white">Google Gemini 2.5 Flash AI Engine</h2>
                <p>
                  CampaignMind integrates directly with the <strong>Google Gemini 2.5 Flash API</strong>. System prompts instruct the model to return structured JSON without markdown wrapper fences.
                </p>
                <div className="p-4 rounded-xl bg-secondary/50 border border-white/5 font-mono text-xs text-purple-300">
                  response_mime_type: "application/json"
                </div>
              </section>
            )}

            {activeSection === 'campaign-history' && (
              <section className="space-y-4">
                <h2 className="text-2xl font-extrabold text-white">Campaign History & Persistence</h2>
                <p>
                  All generated campaign deliverables (Buyer Personas, Strategies, Google Ads, Facebook Ads, Instagram Ads, LinkedIn Ads, SEO Keywords, Hashtags, Budget Allocations) are automatically saved to your PostgreSQL database.
                </p>
              </section>
            )}

            {activeSection === 'faqs' && (
              <section className="space-y-4">
                <h2 className="text-2xl font-extrabold text-white">Frequently Asked Questions</h2>
                <div className="space-y-4 pt-2">
                  <div>
                    <h4 className="font-bold text-white">Can I edit my campaign after generation?</h4>
                    <p className="mt-1">Yes, open any campaign details view and click the <strong>Edit Campaign</strong> button.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">What happens if the Gemini API rate limit is reached?</h4>
                    <p className="mt-1">The system falls back gracefully to a fallback strategy response without crashing.</p>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'api-overview' && (
              <section className="space-y-4">
                <h2 className="text-2xl font-extrabold text-white">API Overview</h2>
                <p>
                  The FastAPI backend exposes endpoints under <code>/api/v1</code>. View interactive OpenAPI documentation at <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">http://localhost:8000/docs</a>.
                </p>
              </section>
            )}
          </article>
        </div>
      </main>
    </div>
  )
}
