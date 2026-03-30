'use client'

import { getOrderStatusColor, getOrderStatusLabel, getSourceColor, getSourceLabel, formatCurrency, formatDate } from '@/lib/utils'

interface OrderCardProps {
  order: {
    id: string
    order_number?: number
    customer_name: string
    customer_phone: string
    status: string
    source: string
    total: number
    items: Array<{ product_name: string; quantity: number }>
    created_at: string
  }
  onStatusChange?: (orderId: string, newStatus: string) => void
}

const statusFlow: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'out_for_delivery',
  out_for_delivery: 'delivered',
}

const statusActionLabel: Record<string, string> = {
  pending: 'Confirmar',
  confirmed: 'Iniciar preparo',
  preparing: 'Marcar pronto',
  ready: 'Despachar',
  out_for_delivery: 'Entregue',
}

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const nextStatus = statusFlow[order.status]

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-blue-500/20 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">#{order.order_number?.toString().padStart(3, '0') ?? order.id.slice(0, 6)}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getOrderStatusColor(order.status)}`}>
              {getOrderStatusLabel(order.status)}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getSourceColor(order.source)}`}>
              {getSourceLabel(order.source)}
            </span>
          </div>
          <div className="text-white/60 text-sm">{order.customer_name} · {order.customer_phone}</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-blue-400">{formatCurrency(order.total)}</div>
          <div className="text-white/40 text-xs">{formatDate(order.created_at)}</div>
        </div>
      </div>

      <div className="text-sm text-white/50 mb-4">
        {order.items.map((item, i) => (
          <span key={i}>{item.quantity}x {item.product_name}{i < order.items.length - 1 ? ', ' : ''}</span>
        ))}
      </div>

      {nextStatus && onStatusChange && (
        <div className="flex gap-2">
          <button
            onClick={() => onStatusChange(order.id, nextStatus)}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm py-2 rounded-lg transition-colors font-medium"
          >
            {statusActionLabel[order.status]}
          </button>
          {order.status === 'pending' && (
            <button
              onClick={() => onStatusChange(order.id, 'cancelled')}
              className="px-3 bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 text-sm py-2 rounded-lg transition-colors border border-white/10"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  )
}
