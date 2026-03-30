'use client'

import { useState } from 'react'

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState('loja')

  const tabs = [
    { id: 'loja', label: '🏪 Loja' },
    { id: 'delivery', label: '🏍️ Delivery' },
    { id: 'horarios', label: '🕐 Horários' },
    { id: 'pagamentos', label: '💳 Pagamentos' },
    { id: 'whatsapp', label: '💬 WhatsApp' },
    { id: 'ifood', label: '🔴 iFood' },
  ]

  const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Configurações</h1>
        <p className="text-white/50 text-sm">Gerencie as configurações da sua loja</p>
      </div>

      <div className="flex gap-6">
        {/* Tab nav */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                  tab === t.id ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {tab === 'loja' && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
              <h2 className="font-semibold text-lg">Informações da loja</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Nome da loja</label>
                  <input defaultValue="Hamburgueria do João" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Slug (URL do cardápio)</label>
                  <div className="flex">
                    <span className="bg-white/10 border border-r-0 border-white/10 rounded-l-lg px-3 py-3 text-white/40 text-sm">konvert.app/</span>
                    <input defaultValue="hamburgueria-joao" className="flex-1 bg-white/5 border border-white/10 rounded-r-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Telefone</label>
                  <input defaultValue="(11) 3333-0000" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">WhatsApp</label>
                  <input defaultValue="(11) 99999-0000" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-white/70 mb-2">Endereço</label>
                  <input defaultValue="Rua das Flores, 123 - São Paulo, SP" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Salvar alterações
              </button>
            </div>
          )}

          {tab === 'delivery' && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
              <h2 className="font-semibold text-lg">Configurações de entrega</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Taxa de entrega (R$)</label>
                  <input type="number" defaultValue="5.00" step="0.50" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Pedido mínimo (R$)</label>
                  <input type="number" defaultValue="25.00" step="1" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Raio de entrega (km)</label>
                  <input type="number" defaultValue="5" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Tempo estimado (min)</label>
                  <input type="number" defaultValue="45" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Salvar alterações
              </button>
            </div>
          )}

          {tab === 'horarios' && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-lg">Horários de funcionamento</h2>
              {DAYS.map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-white/70">{day}</div>
                  <input type="time" defaultValue="11:00" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                  <span className="text-white/30">até</span>
                  <input type="time" defaultValue="23:00" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                  <label className="flex items-center gap-2 text-sm text-white/50">
                    <input type="checkbox" className="w-4 h-4" />
                    Fechado
                  </label>
                </div>
              ))}
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors mt-4">
                Salvar horários
              </button>
            </div>
          )}

          {tab === 'pagamentos' && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
              <h2 className="font-semibold text-lg">Formas de pagamento</h2>
              <div className="space-y-4">
                {[
                  { id: 'pix', label: 'Pix', desc: 'Via EFI/Gerencianet — QR Code e copia-e-cola', icon: '💲' },
                  { id: 'credit', label: 'Cartão de crédito', desc: 'Via Stripe — checkout transparente', icon: '💳' },
                  { id: 'debit', label: 'Cartão de débito', desc: 'Via Stripe — checkout transparente', icon: '💳' },
                  { id: 'cash', label: 'Dinheiro', desc: 'Pagamento na entrega', icon: '💵' },
                ].map((pm) => (
                  <div key={pm.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{pm.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{pm.label}</div>
                        <div className="text-white/40 text-xs">{pm.desc}</div>
                      </div>
                    </div>
                    <div className="relative w-10 h-5 bg-blue-600 rounded-full cursor-pointer">
                      <span className="absolute top-0.5 left-5 w-4 h-4 bg-white rounded-full shadow" />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Chave EFI/Gerencianet (Pix)</label>
                <input type="password" placeholder="sk_live_..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Salvar configurações
              </button>
            </div>
          )}

          {tab === 'whatsapp' && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
              <h2 className="font-semibold text-lg">Integração WhatsApp</h2>
              <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg px-4 py-3 text-sm text-blue-300">
                O WhatsApp é o canal principal de recuperação automática de carrinhos. Configure seu provedor abaixo.
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Provedor</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
                  <option value="evolution">Evolution API (self-hosted)</option>
                  <option value="zapi">Z-API</option>
                  <option value="meta">WhatsApp Business API (Meta)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">URL da API</label>
                <input placeholder="https://sua-evolution-api.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Token / API Key</label>
                <input type="password" placeholder="••••••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Salvar e testar conexão
              </button>
            </div>
          )}

          {tab === 'ifood' && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
              <h2 className="font-semibold text-lg">Integração iFood</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3 text-sm text-yellow-300">
                Disponível nos planos Pro e Enterprise. Autorize o Konvert no portal de desenvolvedores do iFood via OAuth2.
              </div>
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🔴</div>
                <p className="text-white/50 mb-4">Conecte sua loja do iFood ao Konvert</p>
                <button className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Conectar com iFood
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
