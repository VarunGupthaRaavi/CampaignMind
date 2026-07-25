import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Shield, User as UserIcon, Calendar, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { apiClient } from '@/lib/api-client'
import { APIResponse } from '@/types/api'
import { UserProfile } from '@/types/user'

export function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: async () => {
      const url = searchTerm ? `/admin/users?query=${encodeURIComponent(searchTerm)}` : '/admin/users'
      const res = await apiClient<APIResponse<UserProfile[]>>(url)
      return res.data
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const res = await apiClient<APIResponse<UserProfile>>(`/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      })
      return res.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast('Role Updated', `User "${data.email}" role set to ${data.role}.`, 'success')
    },
    onError: (err: any) => {
      toast('Update Failed', err?.message || 'Could not update role.', 'error')
    },
  })

  const handleToggleRole = (user: UserProfile) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    if (window.confirm(`Change role for "${user.email}" to "${newRole}"?`)) {
      updateRoleMutation.mutate({ userId: user.id, role: newRole })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">View registered accounts and manage admin permissions.</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="glass-panel rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg text-white">Registered Users ({(users || []).length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : (
            <table className="w-full text-left text-xs text-muted-foreground">
              <thead className="bg-white/5 text-white uppercase text-[11px] font-semibold">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(users || []).map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{u.full_name || 'Anonymous User'}</div>
                      <div className="text-muted-foreground text-xs">{u.email}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant={u.role === 'admin' ? 'success' : 'default'} className="px-2.5 py-0.5 capitalize">
                        {u.role || 'user'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Active
                      </span>
                    </td>
                    <td className="p-4">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleRole(u)}
                        disabled={updateRoleMutation.isPending}
                        className="text-xs gap-1 border-white/10"
                      >
                        <Shield className="h-3.5 w-3.5 text-purple-400" />
                        {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
