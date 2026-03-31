'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { OrderCard } from '@/components/dashboard/order-card'
import { createClient } from '@/lib/supabase/client'
import type { Order } from '@/lib/types'

const FILTER_TABS = [
  { id: 'all', label: 'Todos' },
  { id: 'pending', label: 'Pendentes' },
  { id: 'confirmed', label: 'Confirmados' },
  { id: 'preparing', label: 'Preparando' },
  { id: 'out_for_delivery', label: 'Em entrega' },
  { id: 'delivered', label: 'Entregues' },
  { id: 'cancelled', label: 'Cancelados' },
]

function OrderSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="h-4 w-16 bg-white/10 rounded" />
            <div className="h-4 w-20 bg-white/10 rounded-full" />
            <div className="h-4 w-16 bg-white/10 rounded-full" />
          </div>
          <div className="h-3 w-40 bg-white/10 rounded" />
        </div>
        <div className="space-y-1 text-right">
          <div className="h-4 w-20 bg-white/10 rounded" />
          <div className="h-3 w-14 bg-white/10 rounded" />
        </div>
      </div>
      <div className="h-3 w-48 bg-white/10 rounded mb-4" />
      <div className="h-8 bg-white/10 rounded-lg" />
    </div>
  )
}

export default function PedidosPage() {
  const [filter, setFilter] = useState('all')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [storeId, setStoreId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Buscar store do usuário
  useEffect(() => {
    async function fetchStore() {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Usuário não autenticado')
        setLoading(false)
        return
      }

      const { data: teamMember } = await supabase
        .from('team_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (!teamMember) {
        setError('Nenhuma organização encontrada')
        setLoading(false)
        return
      }

      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('organization_id', teamMember.organization_id)
        .limit(1)
        .single()

      if (!store) {
        setError('Configure sua loja primeiro')
        setLoading(false)
        return
      }

      setStoreId(store.id)
    }

    fetchStore()
  }, [])

  // Buscar pedidos quando storeId estiver disponível
  const fetchOrders = useCallback(async () => {
    if (!storeId) return

    setLoading(true)
    const supabase = createClient()

    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .limit(100)

    if (fetchError) {
      setError('Erro ao carregar pedidos')
      setLoading(false)
      return
    }

    const mapped: Order[] = (data ?? []).map((o: Record<string, unknown>) => ({
      ...o,
      items: Array.isArray(o.items) ? o.items : [],
    })) as Order[]

    setOrders(mapped)
    setLoading(false)
  }, [storeId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders()
  }, [fetchOrders])

  // Atualizar status no Supabase
  async function handleStatusChange(orderId: string, newStatus: string) {
    const supabase = createClient()

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (updateError) {
      console.error('Erro ao atualizar status:', updateError)
      return
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o))
    )
  }

  const filtered =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const counts = FILTER_TABS.reduce(
    (acc, tab) => {
      acc[tab.id] =
        tab.id === 'all'
          ? orders.length
          : orders.filter((o) => o.status === tab.id).length
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Pedidos</h1>
          <p className="text-white/50 text-sm">Central unificada de todos os canais</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/60 text-sm hover:text-white hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Atualizar
          </button>
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-green-400 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Ao vivo
          </div>
        </div>
      </div>

      {/* Erro de store */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-400 text-sm">
          {error === 'Configure sua loja primeiro' ? (
            <>
              Configure sua loja antes de visualizar pedidos.{' '}
              <Link href="/dashboard/configuracoes" className="underline">
                Ir para configurações
              </Link>
            </>
          ) : (
            error
          )}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              filter === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20'
            }`}
          >
            {tab.label}
            {counts[tab.id] > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filter === tab.id ? 'bg-white/20' : 'bg-white/10'
                }`}
              >
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-white/30">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-lg font-medium mb-1">
            {filter === 'all' ? 'Nenhum pedido ainda' : 'Nenhum pedido neste status'}
          </p>
          <p className="text-sm">
            {filter === 'all'
              ? 'Os pedidos dos seus canais aparecerão aqui'
              : 'Tente outro filtro ou aguarde novos pedidos'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
