'use server'

import { createClient } from '@/lib/supabase/server'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')    // Remove special chars
    .trim()
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-')             // Remove consecutive hyphens
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

export async function createOrganization(name: string, ownerId: string) {
  const supabase = await createClient()
  const slug = generateSlug(name)

  const { data, error } = await supabase
    .from('organizations')
    .insert({
      name,
      slug,
      owner_id: ownerId,
      plan: 'starter',
    })
    .select()
    .single()

  if (error) {
    // If slug conflicts, append a random suffix
    if (error.code === '23505') {
      const uniqueSlug = `${slug}-${Math.random().toString(36).slice(2, 7)}`
      const { data: retryData, error: retryError } = await supabase
        .from('organizations')
        .insert({
          name,
          slug: uniqueSlug,
          owner_id: ownerId,
          plan: 'starter',
        })
        .select()
        .single()

      if (retryError) throw new Error(retryError.message)
      return retryData
    }
    throw new Error(error.message)
  }

  return data
}

export async function createStore(orgId: string, name: string) {
  const supabase = await createClient()
  const slug = generateSlug(name)

  const { data, error } = await supabase
    .from('stores')
    .insert({
      organization_id: orgId,
      name,
      slug,
    })
    .select()
    .single()

  if (error) {
    // If slug conflicts within the org, append a random suffix
    if (error.code === '23505') {
      const uniqueSlug = `${slug}-${Math.random().toString(36).slice(2, 7)}`
      const { data: retryData, error: retryError } = await supabase
        .from('stores')
        .insert({
          organization_id: orgId,
          name,
          slug: uniqueSlug,
        })
        .select()
        .single()

      if (retryError) throw new Error(retryError.message)
      return retryData
    }
    throw new Error(error.message)
  }

  return data
}

export async function getUserOrganization() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return null

  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (error) return null
  return data
}

export async function getUserStores() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return []

  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!org) return []

  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('organization_id', org.id)
    .order('created_at', { ascending: true })

  if (error) return []
  return data
}
