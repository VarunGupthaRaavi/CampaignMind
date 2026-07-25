import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

// Zod Schema Definition
export const campaignFormSchema = z.object({
  title: z.string().min(3, 'Campaign Name must be at least 3 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  description: z.string().min(10, 'Product Description must be at least 10 characters'),
  target_audience: z.string().min(5, 'Target Audience description must be at least 5 characters'),
  budget: z.string().min(1, 'Please select a budget range'),
  goal: z.string().min(1, 'Please select a campaign goal'),
  tone: z.string().min(1, 'Please select a brand tone'),
  platforms: z.array(z.string()).min(1, 'Please select at least one platform'),
})

export type CampaignFormValues = z.infer<typeof campaignFormSchema>

const industryOptions = [
  'Technology & SaaS',
  'E-commerce & Retail',
  'Healthcare & Wellness',
  'Financial Services & Fintech',
  'Education & EdTech',
  'Real Estate & Construction',
  'Entertainment & Media',
  'Professional Services',
]

const budgetOptions = [
  '< ₹50,000 / month',
  '₹50,000 - ₹2,00,000 / month',
  '₹2,00,000 - ₹10,00,000 / month',
  '₹10,00,000 - ₹50,00,000 / month',
  '₹50,00,000+ / month',
]

const goalOptions = [
  'Lead Generation & Registrations',
  'Brand Awareness & Reach',
  'Direct Sales & Revenue',
  'Product Launch & Early Access',
  'Community Engagement & Retention',
]

const toneOptions = [
  'Professional & Authoritative',
  'Friendly & Approachable',
  'Urgent & Action-Oriented',
  'Playful & Creative',
  'Technical & Data-Driven',
]

const platformOptions = [
  { id: 'Google', label: 'Google Search & Display' },
  { id: 'Facebook', label: 'Facebook Feed & Ads' },
  { id: 'Instagram', label: 'Instagram Stories & Reels' },
  { id: 'LinkedIn', label: 'LinkedIn B2B Sponsored Content' },
]

interface CampaignFormProps {
  onSubmit: (values: CampaignFormValues) => void
  isSubmitting?: boolean
}

export function CampaignForm({ onSubmit, isSubmitting = false }: CampaignFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: '',
      industry: 'Technology & SaaS',
      description: '',
      target_audience: '',
      budget: '₹2,00,000 - ₹10,00,000 / month',
      goal: 'Lead Generation & Registrations',
      tone: 'Professional & Authoritative',
      platforms: ['Google', 'LinkedIn'],
    },
  })

  return (
    <Card className="glass-panel border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-white">
          <Sparkles className="h-6 w-6 text-purple-400" /> Create AI Marketing Campaign
        </CardTitle>
        <CardDescription>
          Fill in your product specs and campaign objectives. Gemini 2.5 Flash API will generate buyer personas, ad copy, and multi-channel strategies.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Campaign Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Campaign Name *</label>
            <Input
              placeholder="e.g. Acme SaaS AI Workflow Assistant Launch Q3"
              {...register('title')}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.title.message}
              </p>
            )}
          </div>

          {/* Industry & Budget Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Industry *</label>
              <Select {...register('industry')} disabled={isSubmitting}>
                {industryOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-card text-white">
                    {opt}
                  </option>
                ))}
              </Select>
              {errors.industry && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.industry.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Estimated Budget (INR) *</label>
              <Select {...register('budget')} disabled={isSubmitting}>
                {budgetOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-card text-white">
                    {opt}
                  </option>
                ))}
              </Select>
              {errors.budget && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.budget.message}
                </p>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Product Description *</label>
            <Textarea
              placeholder="Describe your product or service, key value propositions, pricing tier, and what problem it solves..."
              rows={4}
              {...register('description')}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.description.message}
              </p>
            )}
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Target Audience *</label>
            <Textarea
              placeholder="Who are your ideal customers? Mention job roles, demographics, pain points, and interests..."
              rows={3}
              {...register('target_audience')}
              disabled={isSubmitting}
            />
            {errors.target_audience && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.target_audience.message}
              </p>
            )}
          </div>

          {/* Goal & Brand Tone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Campaign Goal *</label>
              <Select {...register('goal')} disabled={isSubmitting}>
                {goalOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-card text-white">
                    {opt}
                  </option>
                ))}
              </Select>
              {errors.goal && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.goal.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Brand Tone *</label>
              <Select {...register('tone')} disabled={isSubmitting}>
                {toneOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-card text-white">
                    {opt}
                  </option>
                ))}
              </Select>
              {errors.tone && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.tone.message}
                </p>
              )}
            </div>
          </div>

          {/* Target Platforms Checkboxes */}
          <div className="space-y-3 pt-2">
            <label className="text-sm font-semibold text-white">Target Platforms *</label>
            <Controller
              name="platforms"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-secondary/30 border border-white/5">
                  {platformOptions.map((platform) => {
                    const isChecked = field.value?.includes(platform.id)
                    return (
                      <Checkbox
                        key={platform.id}
                        label={platform.label}
                        checked={isChecked}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange([...field.value, platform.id])
                          } else {
                            field.onChange(field.value.filter((p: string) => p !== platform.id))
                          }
                        }}
                      />
                    )
                  })}
                </div>
              )}
            />
            {errors.platforms && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.platforms.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t border-white/10 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full gap-2 text-base shadow-xl shadow-purple-600/30 font-semibold"
          >
            <Sparkles className="h-5 w-5" />
            {isSubmitting ? 'Generating AI Campaign Strategy...' : 'Generate Full Campaign'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
