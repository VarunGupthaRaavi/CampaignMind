import { apiClient } from '@/lib/api-client'
import { APIResponse } from '@/types/api'
import { UserProfile, UserUpdateInput, SyncUserPayload } from '@/types/user'

export async function fetchCurrentUser(): Promise<UserProfile> {
  const res = await apiClient<APIResponse<UserProfile>>('/auth/me')
  return res.data
}

export async function syncUserWithBackend(payload?: SyncUserPayload): Promise<UserProfile> {
  const res = await apiClient<APIResponse<UserProfile>>('/auth/sync', {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  })
  return res.data
}

export async function updateUserProfile(payload: UserUpdateInput): Promise<UserProfile> {
  const res = await apiClient<APIResponse<UserProfile>>('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return res.data
}
