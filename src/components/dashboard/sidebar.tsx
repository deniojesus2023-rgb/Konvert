import { createClient } from '@/lib/supabase/server'
import { SidebarClient } from './sidebar-client'

type Store = {
  id: string
  name: string
  slug: string
}

export async function Sidebar() {
  let userName = ''
  let planName = 'starter'
  let stores: Store[] = []

  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Use display name from user metadata or fall back to email prefix
      const metadata = user.user_metadata as { full_name?: string } | undefined
      userName = metadata?.full_name ?? user.email?.split('@')[0] ?? ''

      // Fetch the user's organization
      const { data: org } = await supabase
        .from('organizations')
        .select('id, plan')
        .eq('owner_id', user.id)
        .single()

      if (org) {
        planName = org.plan ?? 'starter'

        // Fetch stores belonging to the organization
        const { data: storeRows } = await supabase
          .from('stores')
          .select('id, name, slug')
          .eq('organization_id', org.id)
          .order('created_at', { ascending: true })

        stores = (storeRows ?? []) as Store[]
      }
    }
  } catch {
    // Silently fall through to graceful fallback — data will be empty strings/arrays
  }

  return (
    <SidebarClient
      userName={userName}
      planName={planName}
      stores={stores}
      currentStoreId={stores[0]?.id ?? null}
    />
  )
}
