import { formatCurrency, formatDate } from '@/lib/utils'
import { StatsCard } from '@/components/dashboard/stats-card'

const DEMO_CARTS = [
  { id: '1', customer_name: 'Thiago Martins', phone: '(11) 98888-0001', items: [{ product_name: 'X-Bacon', quantity: 2 }, { product_name: 'Coca-Cola', quantity: 2 }], subtotal: 79.6, stage: 'checkout', abandoned_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(), attempts: 1, recovered: false, coupon_sent: 'VOLTA10' },
  { id: '2', customer_name: 'Camila Reis', phone: '(11) 98888-0002', items: [{ product_name: 'Pizza Margherita', quantity: 1 }], subtotal: 54.9, stage: 'payment_failed', abandoned_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(), attempts: 2, recovered: true, coupon_sent: 'VOLTA15' },
  { id: '3', customer_name: 'Diego Araújo', phone: '(11) 98888-0003', items: [{ product_name: 'Combo Família', quantity: 1 }], subtotal: 89.9, stage: 'cart', abandoned_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(), attempts: 0, recovered: false, coupon_sent: null },
  { id: '4', customer_name: 'Juliana Costa', phone: '(11) 98888-0004', items: [{ product_name: 'Açaí 500ml', quantity: 2 }], subtotal: 43.8, stage: 'pix_expired', abandoned_at: new Date(Date.now() - 55 * 60 * 1000).toISOString(), attempts: 2, recovered: true, coupon_sent: null },
]

const STAGE_LABELS: Record<string, string> = {
  browsing: 'Navegando',
  cart: 'No carrinho',
  checkout: 'No checkout',
  payment_failed: 'Pagamento falhou',
  pix_expired: 'Pix expirado',
}

const DEMO_RULES = [
  { id: 'r1', name: 'Lembrete 15min', trigger: 'cart_abandoned', delay: 15, is_active: true, conversions: 28 },
  { id: 'r2', name: 'Cupom 30min', trigger: 'cart_abandoned', delay: 30, coupon: '15%', is_active: true, conversions: 14 },
  { id: 'r3', name: 'Reativação 30 dias', trigger: 'inactive_customer', delay: 43200, is_active: false, conversions: 5 },
]

export default function RecuperacaoPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Recuperação Automática</h1>
        <p className="text-white/50 text-sm">Motor inteligente de recuperação via WhatsApp</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Carrinhos este mês" value="87" icon="🛒" />
        <StatsCard label="Recuperados" value="31" change="36%" changePositive icon="✅" />
        <StatsCard label="Taxa de recuperação" value="35,6%" change="4%" changePositive icon="📈" />
        <StatsCard label="Receita recuperada" value="R$2.840" change="12%" changePositive icon="💰" />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Carrinhos abandonados */}
        <div className="lg:col-span-3">
          <h2 className="font-semibold mb-4">Carrinhos abandonados recentes</h2>
          <div className="space-y-3">
            {DEMO_CARTS.map((cart) => (
              <div key={cart.id} className={`bg-white/5 border rounded-xl p-5 ${cart.recovered ? 'border-green-500/20' : 'border-white/10'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{cart.customer_name}</span>
                      {cart.recovered && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Recuperado ✓</span>}
                    </div>
                    <div className="text-white/50 text-sm">{cart.phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-400">{formatCurrency(cart.subtotal)}</div>
                    <div className="text-white/40 text-xs">{STAGE_LABELS[cart.stage]}</div>
                  </div>
                </div>

                <div className="text-sm text-white/50 mb-3">
                  {cart.items.map((item, i) => `${item.quantity}x ${item.product_name}`).join(', ')}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span>Abandonado {formatDate(cart.abandoned_at)}</span>
                    {cart.attempts > 0 && <span>· {cart.attempts} tentativa{cart.attempts > 1 ? 's' : ''}</span>}
                    {cart.coupon_sent && <span>· Cupom: {cart.coupon_sent}</span>}
                  </div>
                  {!cart.recovered && (
                    <button className="text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg transition-colors">
                      Enviar agora
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regras de recuperação */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Regras ativas</h2>
            <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">+ Nova regra</button>
          </div>
          <div className="space-y-3">
            {DEMO_RULES.map((rule) => (
              <div key={rule.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-sm">{rule.name}</div>
                    <div className="text-white/40 text-xs mt-0.5">
                      {rule.delay < 60 ? `${rule.delay}min` : `${Math.floor(rule.delay / 60 / 24)} dias`} após abandono
                      {rule.coupon && ` · Cupom ${rule.coupon}`}
                    </div>
                  </div>
                  <div className={`w-8 h-4 rounded-full transition-colors ${rule.is_active ? 'bg-blue-600' : 'bg-white/20'} relative`}>
                    <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${rule.is_active ? 'left-4' : 'left-0.5'}`} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-white/30">{rule.conversions} conversões este mês</span>
                </div>
              </div>
            ))}
          </div>

          {/* Fluxo visual */}
          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-4">Fluxo de recuperação</h3>
            <div className="space-y-3">
              {[
                { time: '0 min', label: 'Cliente abandona', color: 'bg-yellow-500' },
                { time: '15 min', label: 'Mensagem de lembrete', color: 'bg-blue-500' },
                { time: '30 min', label: 'Cupom automático', color: 'bg-green-500' },
                { time: '✓', label: 'Pedido recuperado!', color: 'bg-emerald-500' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${step.color} rounded-full flex items-center justify-center text-xs font-bold shrink-0`}>
                    {step.time}
                  </div>
                  <span className="text-sm text-white/70">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
