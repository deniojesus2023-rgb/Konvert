import { StatsCard } from '@/components/dashboard/stats-card'
import { OrderCard } from '@/components/dashboard/order-card'

const demoOrders = [
  {
    id: 'a1b2c3',
    order_number: 42,
    customer_name: 'João Silva',
    customer_phone: '(11) 99999-0001',
    status: 'preparing',
    source: 'own',
    total: 78.5,
    items: [{ product_name: 'X-Bacon', quantity: 2 }, { product_name: 'Coca-Cola', quantity: 1 }],
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'd4e5f6',
    order_number: 41,
    customer_name: 'Maria Santos',
    customer_phone: '(11) 99999-0002',
    status: 'pending',
    source: 'ifood',
    total: 45.9,
    items: [{ product_name: 'Pizza Margherita', quantity: 1 }],
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'g7h8i9',
    order_number: 40,
    customer_name: 'Carlos Lima',
    customer_phone: '(11) 99999-0003',
    status: 'out_for_delivery',
    source: 'whatsapp',
    total: 112.0,
    items: [{ product_name: 'Combo Família', quantity: 1 }, { product_name: 'Suco Natural', quantity: 2 }],
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
]

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-white/50 text-sm">Segunda-feira, 30 de março de 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Receita hoje" value="R$1.284,50" change="12%" changePositive icon="💰" />
        <StatsCard label="Pedidos hoje" value="23" change="8%" changePositive icon="📋" />
        <StatsCard label="Ticket médio" value="R$55,85" change="3%" changePositive icon="🧾" />
        <StatsCard label="Taxa de recuperação" value="34%" change="5%" changePositive icon="🔄" />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Carrinhos abandonados" value="7" icon="🛒" />
        <StatsCard label="Carrinhos recuperados" value="3" change="43%" changePositive icon="✅" />
        <StatsCard label="Clientes ativos" value="142" change="2%" changePositive icon="👥" />
        <StatsCard label="Receita mês" value="R$28.450" change="15%" changePositive icon="📈" />
      </div>

      {/* Pedidos recentes + canal */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pedidos ativos */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Pedidos ativos</h2>
            <a href="/dashboard/pedidos" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">Ver todos →</a>
          </div>
          <div className="space-y-3">
            {demoOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>

        {/* Canal e status */}
        <div className="space-y-6">
          {/* Por canal */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Pedidos por canal</h3>
            <div className="space-y-3">
              {[
                { label: 'Cardápio próprio', value: 12, percent: 52, color: 'bg-blue-500' },
                { label: 'iFood', value: 8, percent: 35, color: 'bg-red-500' },
                { label: 'WhatsApp', value: 3, percent: 13, color: 'bg-green-500' },
              ].map((ch) => (
                <div key={ch.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{ch.label}</span>
                    <span className="text-white/50">{ch.value} ({ch.percent}%)</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${ch.color} rounded-full`} style={{ width: `${ch.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recuperação recente */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Recuperação WhatsApp</h3>
            <div className="space-y-3">
              {[
                { name: 'Ana Costa', value: 'R$67,00', time: '15min', status: 'Recuperado' },
                { name: 'Pedro Alves', value: 'R$43,50', time: '30min', status: 'Recuperado' },
                { name: 'Lucia Mendes', value: 'R$89,00', time: '15min', status: 'Enviado' },
              ].map((r) => (
                <div key={r.name} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="text-white/80">{r.name}</div>
                    <div className="text-white/40 text-xs">{r.value} · {r.time}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${r.status === 'Recuperado' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
            <a href="/dashboard/recuperacao" className="block text-center text-blue-400 text-sm mt-4 hover:text-blue-300 transition-colors">
              Ver detalhes →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
