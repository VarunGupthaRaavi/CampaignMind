import { apiClient } from '@/lib/api-client'
import { APIResponse } from '@/types/api'

export interface CampaignMetricData {
  id: string
  campaign_id: string
  channel: string
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  spend: number
  created_at: string
}

export async function fetchCampaignMetrics(campaignId: string): Promise<CampaignMetricData[]> {
  const res = await apiClient<APIResponse<CampaignMetricData[]>>(`/analytics/${campaignId}`)
  return res.data
}
