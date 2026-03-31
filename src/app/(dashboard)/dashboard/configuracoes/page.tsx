'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState('loja')
  const [storeId, setStoreId] = useState<string | null>(null)

  // WhatsApp config state
  const [waApiUrl, setWaApiUrl] = useState('')
  const [waInstance, setWaInstance] = useState('')
  const [waApiKey, setWaApiKey] = useState('')
  const [waSaving, setWaSaving] = useState(false)
  const [waSaved, setWaSaved] = useState(false)
  const [waError, setWaError] = useState('')
  const [waTesting, setWaTesting] = useState(false)
  const [waTestResult, setWaTestResult] = useState<'ok' | 'fail' | null>(null)

  const loadSettings = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .eq('owner_id', user.id)
      .single()
    if (!org) return

    const { data: store } = await supabase
      .from('stores')
      .select('id, settings')
      .eq('organization_id', org.id)
      .single()
    if (!store) return

    setStoreId(store.id)
    const wa = (store.settings as Record<string, Record<string, string>>)?.whatsapp
    if (wa) {
      setWaApiUrl(wa.api_url ?? '')
      setWaInstance(wa.instance ?? '')
      setWaApiKey(wa.api_key ?? '')
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSettings()
  }, [loadSettings])

  async function saveWhatsApp() {
    if (!storeId) return
    setWaSaving(true)
    setWaError('')
    setWaSaved(false)

    const supabase = createClient()
    const { data: store } = await supabase
      .from('stores')
      .select('settings')
      .eq('id', storeId)
      .single()

    const existing = (store?.settings as Record<string, unknown>) ?? {}
    const { error } = await supabase
      .from('stores')
      .update({
        settings: {
          ...existing,
          whatsapp: {
            api_url: waApiUrl.trim(),
            instance: waInstance.trim(),
            api_key: waApiKey.trim(),
          },
        },
      })
      .eq('id', storeId)

    setWaSaving(false)
    if (error) { setWaError(error.message); return }
    setWaSaved(true)
    setTimeout(() => setWaSaved(false), 3000)
  }

  async function testWhatsApp() {
    if (!waApiUrl || !waInstance || !waApiKey) return
    setWaTesting(true)
    setWaTestResult(null)
    try {
      const res = await fetch(`${waApiUrl.trim()}/instance/fetchInstances`, {
        headers: { apikey: waApiKey.trim() },
      })
      setWaTestResult(res.ok ? 'ok' : 'fail')
    } catch {
      setWaTestResult('fail')
    }
    setWaTesting(false)
  }

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
                O WhatsApp é o canal principal de recuperação automática de carrinhos. Configure o seu Evolution API abaixo — essas credenciais são usadas pelo cron de recuperação.
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">URL da Evolution API</label>
                <input
                  value={waApiUrl}
                  onChange={(e) => setWaApiUrl(e.target.value)}
                  placeholder="https://sua-evolution-api.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Nome da instância</label>
                <input
                  value={waInstance}
                  onChange={(e) => setWaInstance(e.target.value)}
                  placeholder="minha-loja"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <p className="text-white/30 text-xs mt-1">Nome da instância criada no painel da Evolution API</p>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">API Key</label>
                <input
                  type="password"
                  value={waApiKey}
                  onChange={(e) => setWaApiKey(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {waError && (
                <p className="text-red-400 text-sm">{waError}</p>
              )}
              {waTestResult === 'ok' && (
                <p className="text-green-400 text-sm">Conexão bem-sucedida!</p>
              )}
              {waTestResult === 'fail' && (
                <p className="text-red-400 text-sm">Falha na conexão. Verifique a URL, instância e API Key.</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={testWhatsApp}
                  disabled={waTesting || !waApiUrl || !waInstance || !waApiKey}
                  className="flex-1 border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {waTesting ? 'Testando...' : 'Testar conexão'}
                </button>
                <button
                  onClick={saveWhatsApp}
                  disabled={waSaving || !waApiUrl || !waInstance || !waApiKey}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {waSaving ? 'Salvando...' : waSaved ? 'Salvo!' : 'Salvar configurações'}
                </button>
              </div>
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
