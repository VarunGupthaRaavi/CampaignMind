export interface UserProfile {
  id: string
  supabase_uid: string
  email: string
  full_name?: string
  company_name?: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserUpdateInput {
  email?: string
  full_name?: string
  company_name?: string
  role?: string
}

export interface SyncUserPayload {
  email?: string
  full_name?: string
  company_name?: string
}
