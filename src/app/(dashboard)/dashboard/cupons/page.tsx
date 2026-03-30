'use client'

import { useState } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'

const DEMO_COUPONS = [
  { id: '1', code: 'VOLTA10', type: 'percentage', value: 10, min_order: 30, uses: 14, max_uses: 100, is_active: true, is_auto: false, expires_at: '2026-04-30T23:59:00Z' },
  { id: '2', code: 'VOLTA15', type: 'percentage', value: 15, min_order: 50, uses: 8, max_uses: 50, is_active: true, is_auto: true, expires_at: null },
  { id: '3', code: 'PROMO20', type: 'fixed', value: 20, min_order: 80, uses: 3, max_uses: 20, is_active: true, is_auto: false, expires_at: '2026-03-31T23:59:00Z' },
  { id: '4', code: 'BEMVINDO', type: 'percentage', value: 5, min_order: 0, uses: 42, max_uses: null, is_active: false, is_auto: false, expires_at: null },
  { id: '5', code: 'AUTO_8F2K', type: 'percentage', value: 15, min_order: 50, uses: 1, max_uses: 1, is_active: true, is_auto: true, expires_at: '2026-03-30T18:00:00Z' },
]

export default function CuponsPage() {
  const [coupons, setCoupons] = useState(DEMO_COUPONS)

  function toggleCoupon(id: string) {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, is_active: !c.is_active } : c))
  }

  const active = coupons.filter((c) => c.is_active).length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Cupons</h1>
          <p className="text-white/50 text-sm">{active} cupons ativos de {coupons.length} totais</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Criar cupom
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="text-2xl font-bold text-blue-400 mb-1">{coupons.reduce((a, c) => a + c.uses, 0)}</div>
          <div className="text-white/50 text-sm">Usos totais</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="text-2xl font-bold text-green-400 mb-1">{coupons.filter((c) => c.is_auto).length}</div>
          <div className="text-white/50 text-sm">Gerados automaticamente</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="text-2xl font-bold mb-1">R$847</div>
          <div className="text-white/50 text-sm">Desconto concedido</div>
        </div>
      </div>

      {/* Coupons table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Código</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Tipo</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Valor</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Pedido mínimo</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Usos</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Validade</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon, i) => (
              <tr key={coupon.id} className={`hover:bg-white/5 transition-colors ${i < coupons.length - 1 ? 'border-b border-white/5' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-blue-400">{coupon.code}</span>
                    {coupon.is_auto && (
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">Auto</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-white/70 text-sm capitalize">
                  {coupon.type === 'percentage' ? 'Porcentagem' : 'Fixo'}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                </td>
                <td className="px-6 py-4 text-white/50 text-sm">
                  {coupon.min_order > 0 ? formatCurrency(coupon.min_order) : '—'}
                </td>
                <td className="px-6 py-4 text-sm">
                  {coupon.uses}{coupon.max_uses ? `/${coupon.max_uses}` : ''}
                </td>
                <td className="px-6 py-4 text-white/50 text-sm">
                  {coupon.expires_at ? formatDate(coupon.expires_at) : 'Sem expiração'}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleCoupon(coupon.id)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${coupon.is_active ? 'bg-blue-600' : 'bg-white/20'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${coupon.is_active ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button className="text-white/30 hover:text-red-400 transition-colors text-sm">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
