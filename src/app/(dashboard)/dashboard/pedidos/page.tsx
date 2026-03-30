'use client'

import { useState } from 'react'
import { OrderCard } from '@/components/dashboard/order-card'

const DEMO_ORDERS = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
    order_number: 40,
    customer_name: 'Carlos Lima',
    customer_phone: '(11) 99999-0003',
    status: 'out_for_delivery',
    source: 'whatsapp',
    total: 112.0,
    items: [{ product_name: 'Combo Família', quantity: 1 }, { product_name: 'Suco Natural', quantity: 2 }],
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    order_number: 39,
    customer_name: 'Ana Oliveira',
    customer_phone: '(11) 99999-0004',
    status: 'delivered',
    source: 'own',
    total: 67.0,
    items: [{ product_name: 'X-Salada', quantity: 1 }, { product_name: 'Batata Frita', quantity: 1 }],
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    order_number: 38,
    customer_name: 'Roberto Sousa',
    customer_phone: '(11) 99999-0005',
    status: 'cancelled',
    source: 'ifood',
    total: 35.5,
    items: [{ product_name: 'Açaí 500ml', quantity: 1 }],
    created_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    order_number: 43,
    customer_name: 'Fernanda Castro',
    customer_phone: '(11) 99999-0006',
    status: 'confirmed',
    source: 'own',
    total: 89.0,
    items: [{ product_name: 'Pizza Grande', quantity: 1 }, { product_name: 'Refrigerante 2L', quantity: 1 }],
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
]

const FILTER_TABS = [
  { id: 'all', label: 'Todos' },
  { id: 'pending', label: 'Pendentes' },
  { id: 'preparing', label: 'Preparando' },
  { id: 'out_for_delivery', label: 'Em entrega' },
  { id: 'delivered', label: 'Entregues' },
  { id: 'cancelled', label: 'Cancelados' },
]

export default function PedidosPage() {
  const [filter, setFilter] = useState('all')
  const [orders, setOrders] = useState(DEMO_ORDERS)

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  function handleStatusChange(orderId: string, newStatus: string) {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o))
  }

  const counts = FILTER_TABS.reduce((acc, tab) => {
    acc[tab.id] = tab.id === 'all' ? orders.length : orders.filter((o) => o.status === tab.id).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Pedidos</h1>
          <p className="text-white/50 text-sm">Central unificada de todos os canais</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-green-400 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Ao vivo
          </div>
        </div>
      </div>

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
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === tab.id ? 'bg-white/20' : 'bg-white/10'}`}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <div className="text-4xl mb-3">📋</div>
          <p>Nenhum pedido neste status</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  )
}
