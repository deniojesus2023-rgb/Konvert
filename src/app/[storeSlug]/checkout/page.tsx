'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

const CART_ITEMS = [
  { id: 'p1', name: 'X-Bacon', quantity: 2, price: 32.9 },
  { id: 'p5', name: 'Batata Frita', quantity: 1, price: 14.9 },
]

const DELIVERY_FEE = 5.0
const subtotal = CART_ITEMS.reduce((acc, item) => acc + item.price * item.quantity, 0)
const total = subtotal + DELIVERY_FEE

type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash'

export default function CheckoutPage() {
  const [step, setStep] = useState<'info' | 'payment' | 'pix'>('info')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    zip: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    notes: '',
    coupon: '',
  })

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleInfo(e: React.FormEvent) {
    e.preventDefault()
    setStep('payment')
  }

  function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    if (paymentMethod === 'pix') {
      setStep('pix')
    }
  }

  if (step === 'pix') {
    return (
      <div className="min-h-screen bg-[#0A0F1E] text-white flex flex-col items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2">Pedido confirmado!</h1>
          <p className="text-white/50 mb-8">Escaneie o QR Code para pagar via Pix</p>

          {/* Fake QR Code */}
          <div className="bg-white p-6 rounded-2xl mb-6 mx-auto w-48 h-48 flex items-center justify-center">
            <div className="grid grid-cols-8 gap-0.5 w-full h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'} aspect-square`} />
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left">
            <div className="text-white/50 text-xs mb-1">Código Pix copia e cola</div>
            <div className="font-mono text-xs text-white/80 break-all">00020126330014BR.GOV.BCB.PIX...</div>
            <button className="mt-2 text-blue-400 text-sm hover:text-blue-300 transition-colors">Copiar código</button>
          </div>

          <div className="text-2xl font-bold mb-1">{formatCurrency(total)}</div>
          <div className="text-white/40 text-sm mb-6">Aguardando pagamento... 14:59</div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-white/50">Status</span>
              <span className="text-yellow-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span> Aguardando</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Pedido</span>
              <span>#043</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="javascript:history.back()" className="text-white/50 hover:text-white transition-colors">
            ← Voltar
          </Link>
          <h1 className="font-bold text-xl">Finalizar pedido</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { id: 'info', label: '1. Dados' },
            { id: 'payment', label: '2. Pagamento' },
          ].map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              {i > 0 && <div className="w-8 h-px bg-white/20" />}
              <div className={`text-sm font-medium ${step === s.id ? 'text-white' : 'text-white/40'}`}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Form */}
          <div className="md:col-span-3">
            {step === 'info' && (
              <form onSubmit={handleInfo} className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                  <h2 className="font-semibold">Seus dados</h2>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Nome completo</label>
                    <input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Seu nome" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">WhatsApp</label>
                    <input required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(11) 99999-0000" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                  <h2 className="font-semibold">Endereço de entrega</h2>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-sm text-white/70 mb-2">CEP</label>
                      <input required value={form.zip} onChange={(e) => update('zip', e.target.value)} placeholder="00000-000" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Número</label>
                      <input required value={form.number} onChange={(e) => update('number', e.target.value)} placeholder="123" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Rua</label>
                    <input required value={form.street} onChange={(e) => update('street', e.target.value)} placeholder="Rua das Flores" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Complemento (opcional)</label>
                    <input value={form.complement} onChange={(e) => update('complement', e.target.value)} placeholder="Apto 12, Bloco B" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Observações (opcional)</label>
                    <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Ex: sem cebola, toque a campainha..." rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors resize-none" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-colors">
                  Continuar para pagamento →
                </button>
              </form>
            )}

            {step === 'payment' && (
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
                  <h2 className="font-semibold mb-4">Forma de pagamento</h2>
                  {[
                    { id: 'pix' as PaymentMethod, label: 'Pix', desc: 'Pagamento instantâneo com QR Code', icon: '💲' },
                    { id: 'credit_card' as PaymentMethod, label: 'Cartão de crédito', desc: 'Visa, Mastercard, Elo', icon: '💳' },
                    { id: 'debit_card' as PaymentMethod, label: 'Cartão de débito', desc: 'Visa, Mastercard', icon: '💳' },
                    { id: 'cash' as PaymentMethod, label: 'Dinheiro', desc: 'Pagamento na entrega', icon: '💵' },
                  ].map((pm) => (
                    <label key={pm.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === pm.id ? 'border-blue-500 bg-blue-600/10' : 'border-white/10 hover:border-white/20'}`}>
                      <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="sr-only" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === pm.id ? 'border-blue-500' : 'border-white/30'}`}>
                        {paymentMethod === pm.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                      <span className="text-xl">{pm.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{pm.label}</div>
                        <div className="text-white/40 text-xs">{pm.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <label className="block text-sm text-white/70 mb-2">Cupom de desconto</label>
                  <div className="flex gap-2">
                    <input value={form.coupon} onChange={(e) => update('coupon', e.target.value)} placeholder="VOLTA10" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors uppercase" />
                    <button type="button" className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg text-sm transition-colors">Aplicar</button>
                  </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-colors">
                  {paymentMethod === 'pix' ? 'Gerar QR Code Pix' : 'Confirmar pedido'} →
                </button>
              </form>
            )}
          </div>

          {/* Order summary */}
          <div className="md:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 sticky top-4">
              <h3 className="font-semibold mb-4">Resumo do pedido</h3>
              <div className="space-y-3 mb-4">
                {CART_ITEMS.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-white/70">{item.quantity}x {item.name}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-white/50">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Entrega</span>
                  <span>{formatCurrency(DELIVERY_FEE)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-blue-400">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
