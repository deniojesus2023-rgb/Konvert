import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">K</div>
            <span className="font-bold text-xl">Konvert</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
            <a href="#diferenciais" className="hover:text-white transition-colors">Diferenciais</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2">
              Entrar
            </Link>
            <Link href="/register" className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-2 text-sm text-blue-400 mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Hub Operacional para Deliverys · SaaS
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Transforme seu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              delivery
            </span>
            {' '}em receita previsível
          </h1>
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            Unifique iFood, WhatsApp e seu cardápio próprio em um painel único.
            Recupere carrinhos abandonados automaticamente e aumente seu faturamento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25">
              Criar conta grátis
            </Link>
            <Link href="/login" className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors hover:bg-white/5">
              Ver demonstração
            </Link>
          </div>
          <p className="text-white/40 text-sm mt-6">Sem cartão de crédito · 14 dias grátis · Cancele quando quiser</p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12 border-y border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '12-27%', label: 'Comissão iFood evitada' },
            { value: '35%', label: 'Taxa média de recuperação' },
            { value: '3x', label: 'Mais canais gerenciados' },
            { value: 'R$97', label: 'A partir de por mês' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-blue-400 mb-1">{stat.value}</div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Dores */}
      <section id="funcionalidades" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Três dores. Uma solução.</h2>
            <p className="text-white/50 text-lg">O Konvert resolve os maiores problemas operacionais do delivery no Brasil.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '📦',
                title: 'Fragmentação de canais',
                desc: 'Pare de monitorar iFood, WhatsApp e outros separadamente. O Konvert unifica tudo num painel único com atualização em tempo real.',
                tag: 'Painel unificado',
              },
              {
                icon: '🛒',
                title: 'Carrinhos abandonados',
                desc: 'Recupere automaticamente clientes que abandonaram o pedido via WhatsApp com cupons inteligentes. 15min e 30min após o abandono.',
                tag: 'Recuperação automática',
              },
              {
                icon: '🏪',
                title: 'Gestão multi-loja',
                desc: 'Redes e franquias finalmente têm visão consolidada sem pagar fortunas. Dashboard comparativo entre lojas em tempo real.',
                tag: 'Multi-loja nativo',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-colors group">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="inline-block bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full mb-4">{item.tag}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-6 py-24 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tudo que você precisa para operar</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🍕', title: 'Cardápio próprio', desc: 'URL personalizada, zero comissão' },
              { icon: '💬', title: 'WhatsApp integrado', desc: 'Mensagens automáticas de recuperação' },
              { icon: '🏍️', title: 'Gestão de motoboys', desc: 'Atribuição e rastreamento de entregas' },
              { icon: '📊', title: 'Analytics completo', desc: 'KPIs, receita e performance em tempo real' },
              { icon: '🎟️', title: 'Cupons inteligentes', desc: 'Geração automática baseada no valor do carrinho' },
              { icon: '🔄', title: 'Integração iFood', desc: 'Pedidos sincronizados automaticamente via webhook' },
              { icon: '💳', title: 'Pix + Cartão', desc: 'Pagamentos via EFI e Stripe integrados' },
              { icon: '👥', title: 'Equipe multi-nível', desc: 'Controle de acesso por loja e função' },
              { icon: '📱', title: 'Reativação de clientes', desc: 'Campanhas automáticas para clientes inativos' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-5 hover:border-blue-500/20 transition-colors">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <div className="font-semibold mb-1">{f.title}</div>
                  <div className="text-white/50 text-sm">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Planos simples e transparentes</h2>
            <p className="text-white/50 text-lg">Sem surpresas na fatura. Cancele quando quiser.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: 'R$97',
                desc: 'Para restaurantes individuais',
                features: ['1 loja', 'Cardápio próprio', 'Recuperação básica (1 regra)', 'Até 5 motoboys', 'Relatórios básicos', 'Suporte por e-mail'],
                highlight: false,
              },
              {
                name: 'Pro',
                price: 'R$249',
                desc: 'Para redes de 2-3 lojas',
                features: ['Até 3 lojas', 'Integração iFood', 'Recuperação completa', 'Até 15 motoboys', 'Relatórios avançados', 'Suporte WhatsApp prioritário'],
                highlight: true,
              },
              {
                name: 'Enterprise',
                price: 'R$497',
                desc: 'Para franquias e redes',
                features: ['Até 10 lojas', 'Domínio customizado', 'Recuperação com IA', 'Motoboys ilimitados', 'Relatórios + exportação', 'Suporte dedicado'],
                highlight: false,
              },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-8 border ${plan.highlight ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-500/20' : 'bg-white/5 border-white/10'}`}>
                {plan.highlight && <div className="text-xs font-semibold text-blue-200 mb-4 uppercase tracking-wider">Mais popular</div>}
                <div className="font-bold text-2xl mb-1">{plan.name}</div>
                <div className="text-white/60 text-sm mb-6">{plan.desc}</div>
                <div className="text-5xl font-bold mb-1">{plan.price}</div>
                <div className="text-white/50 text-sm mb-8">/mês</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span className={plan.highlight ? 'text-white' : 'text-white/70'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`block text-center py-3 rounded-xl font-semibold transition-all ${plan.highlight ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
                  Começar agora
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="diferenciais" className="px-6 py-24 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Por que o Konvert?</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 text-white/50 font-normal">Funcionalidade</th>
                  {['Konvert', 'iFood', 'Anota AI', 'Neemo'].map((h) => (
                    <th key={h} className={`py-4 font-semibold ${h === 'Konvert' ? 'text-blue-400' : 'text-white/50'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Cardápio próprio (zero comissão)', true, false, true, true],
                  ['Centralização multi-canal', true, false, false, false],
                  ['Recuperação automática WhatsApp', true, false, false, false],
                  ['Cupom automático inteligente', true, false, false, false],
                  ['Multi-loja nativo', true, false, true, true],
                  ['Gestão de motoboys', true, false, false, false],
                  ['Preço acessível (R$97+)', true, false, false, false],
                ].map(([feature, ...values]) => (
                  <tr key={String(feature)} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 text-white/70">{feature}</td>
                    {values.map((v, i) => (
                      <td key={i} className="py-4 text-center">
                        {v ? <span className="text-green-400">✓</span> : <span className="text-white/20">✕</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Pronto para transformar seu delivery?</h2>
          <p className="text-white/50 text-lg mb-8">Junte-se a centenas de restaurantes que já usam o Konvert.</p>
          <Link href="/register" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-xl text-xl font-semibold transition-all hover:shadow-xl hover:shadow-blue-500/25">
            Criar conta grátis agora
          </Link>
          <p className="text-white/30 text-sm mt-4">14 dias grátis · Sem cartão de crédito</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-bold text-xs">K</div>
            <span className="font-semibold">Konvert</span>
            <span className="text-white/30 text-sm ml-2">Hub Operacional para Deliverys</span>
          </div>
          <p className="text-white/30 text-sm">© 2026 Konvert. Transformando delivery em receita previsível.</p>
        </div>
      </footer>
    </div>
  )
}
