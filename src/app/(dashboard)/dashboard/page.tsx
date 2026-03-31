import Link from 'next/link'
import { redirect } from 'next/navigation'
import { StatsCard } from '@/components/dashboard/stats-card'
import { OrderCard } from '@/components/dashboard/order-card'
import { createClient } from '@/lib/supabase/server'
import type { Order } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Usuário atual
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. Store do usuário (primeira store via organization do team member)
  const { data: teamMember } = await supabase
    .from('team_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  let store = null
  if (teamMember) {
    const { data: storeData } = await supabase
      .from('stores')
      .select('*')
      .eq('organization_id', teamMember.organization_id)
      .limit(1)
      .single()
    store = storeData
  }

  if (!store) {
    redirect('/dashboard/configuracoes?setup=true')
  }

  // 3. KPIs do dia
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { data: ordersToday } = await supabase
    .from('orders')
    .select('id, total, status')
    .eq('store_id', store.id)
    .gte('created_at', todayStart.toISOString())

  const revenueToday = ordersToday
    ? ordersToday
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum: number, o: { total: number }) => sum + (o.total ?? 0), 0)
    : 0
  const ordersCountToday = ordersToday
    ? ordersToday.filter((o: { status: string }) => o.status !== 'cancelled').length
    : 0
  const avgTicket = ordersCountToday > 0 ? revenueToday / ordersCountToday : 0

  // 4. Pedidos recentes
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })
    .limit(3)

  // 5. Recovery stats
  const { count: abandonedCount } = await supabase
    .from('abandoned_carts')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', store.id)
    .eq('recovered', false)

  const { count: recoveredCount } = await supabase
    .from('abandoned_carts')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', store.id)
    .eq('recovered', true)

  const recoveryRate =
    abandonedCount != null && recoveredCount != null && (abandonedCount + recoveredCount) > 0
      ? Math.round((recoveredCount / (abandonedCount + recoveredCount)) * 100)
      : 0

  // Dados do mês
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const { data: ordersMonth } = await supabase
    .from('orders')
    .select('total, status')
    .eq('store_id', store.id)
    .gte('created_at', monthStart.toISOString())

  const revenueMonth = ordersMonth
    ? ordersMonth
        .filter((o: { status: string }) => o.status !== 'cancelled')
        .reduce((sum: number, o: { total: number }) => sum + (o.total ?? 0), 0)
    : 0

  // Pedidos por canal (hoje)
  const channelMap: Record<string, number> = {}
  if (ordersToday) {
    for (const o of ordersToday) {
      const src = (o as { source?: string }).source ?? 'own'
      channelMap[src] = (channelMap[src] ?? 0) + 1
    }
  }
  const totalChannelOrders = Object.values(channelMap).reduce((s, v) => s + v, 0)
  const channels = [
    { label: 'Cardápio próprio', key: 'own', color: 'bg-blue-500' },
    { label: 'iFood', key: 'ifood', color: 'bg-red-500' },
    { label: 'WhatsApp', key: 'whatsapp', color: 'bg-green-500' },
  ].map((ch) => ({
    ...ch,
    value: channelMap[ch.key] ?? 0,
    percent:
      totalChannelOrders > 0
        ? Math.round(((channelMap[ch.key] ?? 0) / totalChannelOrders) * 100)
        : 0,
  }))

  // Formatar valores
  const formatBRL = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const dynamicDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Mapear orders para o formato esperado pelo OrderCard
  const mappedOrders: Order[] = (recentOrders ?? []).map((o: Record<string, unknown>) => ({
    ...o,
    items: Array.isArray(o.items) ? o.items : [],
  })) as Order[]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-white/50 text-sm capitalize">{dynamicDate}</p>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Receita hoje"
          value={formatBRL(revenueToday)}
          icon="💰"
        />
        <StatsCard
          label="Pedidos hoje"
          value={String(ordersCountToday)}
          icon="📋"
        />
        <StatsCard
          label="Ticket médio"
          value={formatBRL(avgTicket)}
          icon="🧾"
        />
        <StatsCard
          label="Taxa de recuperação"
          value={`${recoveryRate}%`}
          icon="🔄"
        />
      </div>

      {/* KPIs secundários */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Carrinhos abandonados"
          value={String(abandonedCount ?? 0)}
          icon="🛒"
        />
        <StatsCard
          label="Carrinhos recuperados"
          value={String(recoveredCount ?? 0)}
          icon="✅"
        />
        <StatsCard
          label="Pedidos ativos"
          value={String(
            (ordersToday ?? []).filter((o: { status: string }) =>
              ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)
            ).length
          )}
          icon="👥"
        />
        <StatsCard
          label="Receita mês"
          value={formatBRL(revenueMonth)}
          icon="📈"
        />
      </div>

      {/* Pedidos recentes + canal */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pedidos ativos */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Pedidos recentes</h2>
            <Link
              href="/dashboard/pedidos"
              className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          {mappedOrders.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-white/30">
              <div className="text-4xl mb-3">📋</div>
              <p className="font-medium">Nenhum pedido ainda</p>
              <p className="text-sm mt-1">Os pedidos aparecerão aqui em tempo real</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mappedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>

        {/* Canal e status */}
        <div className="space-y-6">
          {/* Por canal */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Pedidos por canal hoje</h3>
            {totalChannelOrders === 0 ? (
              <p className="text-white/30 text-sm text-center py-4">Sem dados ainda</p>
            ) : (
              <div className="space-y-3">
                {channels.map((ch) => (
                  <div key={ch.key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">{ch.label}</span>
                      <span className="text-white/50">
                        {ch.value} ({ch.percent}%)
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${ch.color} rounded-full`}
                        style={{ width: `${ch.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Link recuperação */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold mb-2">Recuperação WhatsApp</h3>
            <p className="text-white/40 text-sm mb-4">
              {recoveredCount ?? 0} carrinho{recoveredCount !== 1 ? 's' : ''} recuperado
              {recoveredCount !== 1 ? 's' : ''} hoje
            </p>
            <Link
              href="/dashboard/recuperacao"
              className="block text-center text-blue-400 text-sm hover:text-blue-300 transition-colors"
            >
              Ver detalhes →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
