import { apiClient } from '@/lib/api-client'
import { APIResponse } from '@/types/api'
import { CampaignGenerationRequest, CampaignGenerationResponse, ContentRefinementRequest } from '@/types/ai'

export async function generateCampaignWithAI(
  payload: CampaignGenerationRequest
): Promise<CampaignGenerationResponse> {
  const res = await apiClient<APIResponse<CampaignGenerationResponse>>('/ai/generate-campaign', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function refineContentWithAI(
  payload: ContentRefinementRequest
): Promise<{ refined_text: string }> {
  const res = await apiClient<APIResponse<{ refined_text: string }>>('/ai/refine-content', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data
}
