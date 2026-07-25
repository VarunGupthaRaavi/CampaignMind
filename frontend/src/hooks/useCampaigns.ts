import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchCampaigns,
  fetchCampaignById,
  generateAndSaveCampaign,
  deleteCampaign,
} from '@/api/campaigns'
import { CampaignCreateInput } from '@/types/campaign'

export function useUserCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns,
  })
}

export function useCampaignDetail(id?: string) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => fetchCampaignById(id!),
    enabled: !!id,
  })
}

export function useCreateAndGenerateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CampaignCreateInput) => generateAndSaveCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}
