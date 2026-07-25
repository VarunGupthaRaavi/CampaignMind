import { useMutation } from '@tanstack/react-query'
import { generateCampaignWithAI, refineContentWithAI } from '@/api/ai'
import { CampaignGenerationRequest, ContentRefinementRequest } from '@/types/ai'

export function useGenerateAiCampaign() {
  return useMutation({
    mutationFn: (payload: CampaignGenerationRequest) => generateCampaignWithAI(payload),
  })
}

export function useRefineAiContent() {
  return useMutation({
    mutationFn: (payload: ContentRefinementRequest) => refineContentWithAI(payload),
  })
}
