import { supabase } from './supabase'

/**
 * Formats API URL dynamically ensuring /api/v1 suffix and stripping duplicate slashes
 */
function getApiUrl(endpoint: string): string {
  let baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1').trim()

  // Remove trailing slashes from baseUrl
  baseUrl = baseUrl.replace(/\/+$/, '')

  // Ensure /api/v1 suffix exists if missing
  if (!baseUrl.endsWith('/api/v1')) {
    baseUrl = `${baseUrl}/api/v1`
  }

  // Ensure leading slash on endpoint
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  return `${baseUrl}${cleanEndpoint}`
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options

  // Retrieve current session token from Supabase Auth
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData?.session?.access_token

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  let url = getApiUrl(endpoint)
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  const config: RequestInit = {
    method: options.body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || `API request failed with status ${response.status}`)
  }

  return response.json()
}
