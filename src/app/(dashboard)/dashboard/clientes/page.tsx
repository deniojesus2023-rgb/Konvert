'use client'

import { useState, useEffect, useMemo } from 'react'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Customer } from '@/lib/types'

const TAG_COLORS: Record<string, string> = {
  vip: 'bg-yellow-500/20 text-yellow-400',
  novo: 'bg-blue-500/20 text-blue-400',
  inativo: 'bg-red-500/20 text-red-400',
}

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'vip', label: 'VIP' },
  { id: 'novo', label: 'Novos' },
  { id: 'inativo', label: 'Inativos' },
]

// ── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-white/5 animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-full" />
          <div className="space-y-1">
            <div className="h-3 bg-white/10 rounded w-28" />
            <div className="h-2 bg-white/10 rounded w-20" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4"><div className="h-3 bg-white/10 rounded w-28" /></td>
      <td className="px-6 py-4"><div className="h-3 bg-white/10 rounded w-8" /></td>
      <td className="px-6 py-4"><div className="h-3 bg-white/10 rounded w-20" /></td>
      <td className="px-6 py-4"><div className="h-3 bg-white/10 rounded w-24" /></td>
      <td className="px-6 py-4"><div className="h-3 bg-white/10 rounded w-12" /></td>
      <td className="px-6 py-4" />
    </tr>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  // ── Load customers ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()

        const { data: { user }, error: authErr } = await supabase.auth.getUser()
        if (authErr || !user) throw new Error('Usuário não autenticado')

        const { data: org, error: orgErr } = await supabase
          .from('organizations')
          .select('id')
          .eq('owner_id', user.id)
          .single()
        if (orgErr || !org) throw new Error('Organização não encontrada')

        const { data: store, error: storeErr } = await supabase
          .from('stores')
          .select('id')
          .eq('organization_id', org.id)
          .limit(1)
          .single()
        if (storeErr || !store) throw new Error('Loja não encontrada. Crie sua loja primeiro.')

        const { data: rows, error: custErr } = await supabase
          .from('customers')
          .select('*')
          .eq('store_id', store.id)
          .order('total_spent', { ascending: false })
        if (custErr) throw custErr

        if (!cancelled) {
          setCustomers((rows as Customer[]) ?? [])
        }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erro ao carregar clientes')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  // ── Client-side filtering ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (filter === 'all') return customers
    return customers.filter((c) => Array.isArray(c.tags) && c.tags.includes(filter))
  }, [customers, filter])

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Clientes</h1>
          {loading ? (
            <div className="h-4 bg-white/10 rounded w-36 animate-pulse" />
          ) : (
            <p className="text-white/50 text-sm">{filtered.length} clientes encontrados</p>
          )}
        </div>
        <div className="flex gap-2">
          <button className="bg-white/5 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-6 py-4 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === f.id
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Cliente</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Telefone</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Pedidos</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Total gasto</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Último pedido</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Tags</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {/* Loading skeletons */}
            {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

            {/* Empty state — no customers at all */}
            {!loading && !error && customers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <p className="text-3xl mb-3">👤</p>
                  <p className="text-white/50 font-medium mb-1">Nenhum cliente ainda</p>
                  <p className="text-white/30 text-sm">Os clientes aparecerão aqui após os primeiros pedidos.</p>
                </td>
              </tr>
            )}

            {/* Empty state — filter returned nothing */}
            {!loading && !error && customers.length > 0 && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-white/30">
                  Nenhum cliente neste filtro.
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading && !error && filtered.map((customer, i) => (
              <tr
                key={customer.id}
                className={`hover:bg-white/5 transition-colors ${i < filtered.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600/30 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{customer.name}</div>
                      {customer.email && <div className="text-white/40 text-xs">{customer.email}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-white/70 text-sm">{customer.phone}</td>
                <td className="px-6 py-4 text-sm">{customer.total_orders}</td>
                <td className="px-6 py-4 text-blue-400 text-sm font-medium">{formatCurrency(customer.total_spent)}</td>
                <td className="px-6 py-4 text-white/50 text-sm">
                  {customer.last_order_at ? formatDateShort(customer.last_order_at) : '—'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {Array.isArray(customer.tags) && customer.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[tag] ?? 'bg-gray-500/20 text-gray-400'}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="text-white/30 hover:text-blue-400 text-sm transition-colors">Ver →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
