export interface BudgetBreakdown {
  google: string
  facebook: string
  instagram: string
  linkedin: string
}

export interface GoogleAd {
  headline_1?: string
  headline_2?: string
  headline_3?: string
  headline?: string
  description_1?: string
  description_2?: string
  description?: string
  call_to_action?: string
}

export interface FacebookAd {
  primary_text: string
  headline: string
  description?: string
  call_to_action?: string
}

export interface InstagramAd {
  caption: string
  visual_concept?: string
  call_to_action?: string
}

export interface LinkedInAd {
  post_text?: string
  headline?: string
  target_job_titles?: string[]
  call_to_action?: string
}

export interface CampaignGenerationRequest {
  campaign_id?: string
  product_name?: string
  product_description: string
  industry?: string
  target_audience?: string
  budget?: string
  goal?: string
  tone?: string
  target_channels?: string[]
}

export interface CampaignGenerationResponse {
  buyer_persona: any
  persona?: any
  marketing_strategy: any
  google_ads: GoogleAd[]
  facebook_ads: FacebookAd[]
  instagram_ads: InstagramAd[]
  linkedin_ads: LinkedInAd[]
  keywords: string[]
  hashtags: string[]
  budget_breakdown: BudgetBreakdown | Record<string, string>
  status: string
}

export interface ContentRefinementRequest {
  channel: string
  current_text: string
  instructions: string
}

export interface ContentRefinementResponse {
  refined_text: string
}
