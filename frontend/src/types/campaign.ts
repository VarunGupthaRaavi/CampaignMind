export interface CampaignOutput {
  id: string
  campaign_id: string
  persona?: any
  buyer_persona?: any
  marketing_strategy?: any
  google_ads?: any[]
  facebook_ads?: any[]
  instagram_ads?: any[]
  linkedin_ads?: any[]
  keywords?: string[]
  hashtags?: string[]
  budget_breakdown?: Record<string, string>
  status: string
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  user_id: string
  title: string
  description?: string
  industry?: string
  target_audience?: string
  budget?: string
  goal?: string
  tone?: string
  created_at: string
  updated_at: string
}

export interface CampaignDetail extends Campaign {
  output?: CampaignOutput
}

export interface CampaignCreateInput {
  title: string
  description: string
  industry?: string
  target_audience?: string
  budget?: string
  goal?: string
  tone?: string
  channels?: string[]
}
