import { apiClient } from '@/lib/api-client'
import { APIResponse } from '@/types/api'
import { Campaign, CampaignDetail, CampaignCreateInput } from '@/types/campaign'

export async function generateAndSaveCampaign(input: CampaignCreateInput): Promise<CampaignDetail> {
  const res = await apiClient<APIResponse<CampaignDetail>>('/campaigns/generate-and-save', {
    method: 'POST',
    body: JSON.stringify({
      title: input.title,
      description: input.description,
      industry: input.industry,
      target_audience: input.target_audience,
      budget: input.budget,
      goal: input.goal,
      tone: input.tone,
      channels: input.channels || ['Google', 'Facebook', 'Instagram', 'LinkedIn'],
    }),
  })
  return res.data
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await apiClient<APIResponse<Campaign[]>>('/campaigns')
  return res.data
}

export async function fetchCampaignById(id: string): Promise<CampaignDetail> {
  const res = await apiClient<APIResponse<CampaignDetail>>(`/campaigns/${id}`)
  return res.data
}

export async function updateCampaign(id: string, payload: Partial<CampaignCreateInput>): Promise<Campaign> {
  const res = await apiClient<APIResponse<Campaign>>(`/campaigns/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function deleteCampaign(id: string): Promise<boolean> {
  const res = await apiClient<APIResponse<boolean>>(`/campaigns/${id}`, {
    method: 'DELETE',
  })
  return res.data
}
